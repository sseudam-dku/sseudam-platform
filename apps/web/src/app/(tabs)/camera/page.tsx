import { CameraAccessGuard } from "@/components/camera/camera-access-guard";
import CameraClient from "@/components/camera/camera-client";

export default function CameraPage() {
  return (
    <CameraAccessGuard>
      <CameraClient />
    </CameraAccessGuard>
  );
}
