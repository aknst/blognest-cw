import { ProfileDataForm } from "@/components/forms/users/ProfileDataForm";
import CardLayout from "@/components/layouts/CardLayout";
import { useAuthStore } from "@/states/auth-state";

function ProfileSettingsPage() {
  const { refreshUserDetails, userDetails } = useAuthStore();
  return (
    <CardLayout
      title="Обновление профиля"
      description="На этой странице вы можете обновить информацию о своем профиле.">
      <ProfileDataForm
        user={userDetails}
        onUpdate={async () => {
          await refreshUserDetails();
        }}
      />
    </CardLayout>
  );
}

export default ProfileSettingsPage;
