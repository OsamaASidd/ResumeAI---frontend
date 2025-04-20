// src/features/profile/components/profile-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../schemas";
import { ProfileFormValues } from "../types";

interface ProfileFormProps {
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit: (data: ProfileFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const ProfileForm = ({ 
  defaultValues, 
  onSubmit, 
  isSubmitting,
  onCancel 
}: ProfileFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultValues || {
      firstname: "",
      lastname: "",
      email: "",
      contactno: "",
      country: "",
      city: "",
      jobs: [],
      educations: []
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1">First Name</label>
          <input
            {...register("firstname")}
            className="w-full border rounded p-2"
          />
          {errors.firstname && (
            <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>
          )}
        </div>
        
        <div>
          <label className="block mb-1">Last Name</label>
          <input
            {...register("lastname")}
            className="w-full border rounded p-2"
          />
          {errors.lastname && (
            <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>
          )}
        </div>
        
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border rounded p-2"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label className="block mb-1">Contact Number</label>
          <input
            {...register("contactno")}
            className="w-full border rounded p-2"
          />
          {errors.contactno && (
            <p className="text-red-500 text-sm mt-1">{errors.contactno.message}</p>
          )}
        </div>
        
        <div>
          <label className="block mb-1">Country</label>
          <input
            {...register("country")}
            className="w-full border rounded p-2"
          />
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
          )}
        </div>
        
        <div>
          <label className="block mb-1">City</label>
          <input
            {...register("city")}
            className="w-full border rounded p-2"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>
      </div>
      
      {/* Note: In a complete implementation, you would add UI for jobs and educations arrays */}
      
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;