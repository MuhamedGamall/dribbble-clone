import Link from "next/link";

type Props = {
  params: {
    id: string;
  };
};

const UserProfile = async ({ params }: Props) => {
  return <Link href={"/create-project"}>create</Link>;
};

export default UserProfile;
