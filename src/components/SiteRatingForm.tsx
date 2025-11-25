import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useState } from "react";
import { useCreateRating, SiteRating } from "@/hooks/useSiteRatings";

interface SiteRatingFormProps {
  siteId: string;
  existingRating?: SiteRating;
  onSuccess?: () => void;
}

const RatingStars = ({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
}) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className="focus:outline-none transition-colors"
          >
            <Star
              className={`w-8 h-8 ${
                rating <= value
                  ? "fill-primary text-primary"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export const SiteRatingForm = ({
  siteId,
  existingRating,
  onSuccess,
}: SiteRatingFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<{
    comment: string;
  }>({
    defaultValues: {
      comment: existingRating?.comment || "",
    },
  });

  const [overallRating, setOverallRating] = useState(
    existingRating?.overall_rating || 0
  );
  const [safetyRating, setSafetyRating] = useState(
    existingRating?.safety_rating || 0
  );
  const [marshalRating, setMarshalRating] = useState(
    existingRating?.marshal_rating || 0
  );
  const [gameplayRating, setGameplayRating] = useState(
    existingRating?.gameplay_rating || 0
  );

  const createRating = useCreateRating();

  const onSubmit = async (data: { comment: string }) => {
    if (overallRating === 0 || safetyRating === 0 || marshalRating === 0 || gameplayRating === 0) {
      return;
    }

    await createRating.mutateAsync({
      site_id: siteId,
      user_id: "", // Will be set by the hook
      overall_rating: overallRating,
      safety_rating: safetyRating,
      marshal_rating: marshalRating,
      gameplay_rating: gameplayRating,
      comment: data.comment || undefined,
    });

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <RatingStars
        value={overallRating}
        onChange={setOverallRating}
        label="Overall Rating *"
      />

      <RatingStars
        value={safetyRating}
        onChange={setSafetyRating}
        label="Safety Rating *"
      />

      <RatingStars
        value={marshalRating}
        onChange={setMarshalRating}
        label="Marshal Rating *"
      />

      <RatingStars
        value={gameplayRating}
        onChange={setGameplayRating}
        label="Gameplay Rating *"
      />

      <div className="space-y-2">
        <Label htmlFor="comment">Comment (Optional)</Label>
        <Textarea
          id="comment"
          placeholder="Share your experience at this site..."
          rows={4}
          {...register("comment")}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={
          overallRating === 0 ||
          safetyRating === 0 ||
          marshalRating === 0 ||
          gameplayRating === 0 ||
          createRating.isPending
        }
      >
        {existingRating ? "Update Rating" : "Submit Rating"}
      </Button>
    </form>
  );
};
