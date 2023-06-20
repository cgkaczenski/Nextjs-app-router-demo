import ResetPasswordForm from "./reset-password-form";

export default async function ExampleClientComponent({
  params,
}: {
  params: { userId: string; token: string };
}) {
  const { userId, token } = params;
  return <ResetPasswordForm userId={userId} token={token} />;
}
