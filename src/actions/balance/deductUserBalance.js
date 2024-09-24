export async function deductUserBalance(userId, balance = "", onlyRemoveFromReserevedAmount = "no") {
  try {
    const res = await fetch(`/api/balance/deduct`, {
      method: "PUT",
      body: JSON.stringify({
        userId,
        balance,
        onlyRemoveFromReserevedAmount,
      }),
    });
    const balanceData = await res.json();
    if (!balanceData?.success) {
      throw new Error(balanceData?.message);
    }
    console.log(balanceData?.data);

    return {
      success: true,
      message: "User balance deducted successfully.",
    };
  } catch (error) {
    throw error;
  }
}
