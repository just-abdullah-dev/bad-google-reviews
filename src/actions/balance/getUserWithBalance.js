import { account } from "@/lib/app_write_client";

export async function getUserWithBalance() {
  try {
    const user = await account.get();
    const res = await fetch(`/api/balance?userId=${user?.$id}`, {
      method: "GET",
    });
    const balanceData = await res.json();
    if (!balanceData?.success) {
      throw new Error(balanceData?.message);
    }
    return {
      id: user?.$id,
      email: user?.email,
      name: user?.name,
      balance: balanceData?.data?.balance,
      reservedAmount: balanceData?.data?.reservedAmount,
    };
  } catch (error) {
    throw error;
  }
}