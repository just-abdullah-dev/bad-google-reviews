import { account } from "@/lib/app_write_client";

export async function getUserWithBalance() {
  try {
    const user = await account.get();
    const isAdmin = user.labels.includes("admin");
    const res = await fetch(`/api/balance?userId=${user?.$id}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-store", // Disables caching
      },
    });
    const balanceData = await res.json();
    if (!balanceData?.success) {
      throw new Error(balanceData?.message);
    }
    if (isAdmin) {
      return {
        id: user?.$id,
        email: user?.email,
        name: user?.name,
        isAdmin: true,
        balance: balanceData?.data?.balance,
        reservedAmount: balanceData?.data?.reservedAmount,
      };
    } else {
      return {
        id: user?.$id,
        email: user?.email,
        name: user?.name,
        isAdmin: false,
        balance: balanceData?.data?.balance,
        reservedAmount: balanceData?.data?.reservedAmount,
      };
    }
  } catch (error) {
    throw error;
  }
}
