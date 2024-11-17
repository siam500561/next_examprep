import { cn } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default async function Header() {
  const user = await currentUser();

  return (
    <div className="relative w-full shadow-2xl h-[120px] rounded-xl bg-primary overflow-hidden">
      {/* Profile Image with Gradient */}
      <div className="absolute right-0 top-0 h-full w-[300px] overflow-hidden">
        {user?.imageUrl && (
          <>
            <Image
              src={user.imageUrl}
              alt={user?.fullName || "User"}
              fill
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-primary/50 to-primary" />
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-8">
        <div className="space-y-1">
          <h1
            className={cn(
              "text-2xl font-semibold text-primary-foreground",
              poppins.className
            )}
          >
            Hello, {user?.firstName} {user?.lastName}
          </h1>
          <p
            className={cn(
              "text-primary-foreground/80 text-sm",
              poppins.className
            )}
          >
            Welcome Back, It&apos;s time to get back and start learning new
            course
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute left-[70%] top-1/2 -translate-y-1/2">
        <div className="w-20 h-20 rounded-full border-4 border-primary-foreground/10" />
      </div>
      <div className="absolute left-[68%] top-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full border-2 border-primary-foreground/5" />
      </div>
    </div>
  );
}
