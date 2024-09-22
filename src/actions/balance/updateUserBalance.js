
export async function updateUserBalance(userId, balance = "", reservedAmount = "") {
  try {
    const res = await fetch(`/api/balance`, {
      method: "PUT",
      body: JSON.stringify({
        userId,
        balance,
        reservedAmount,
      }),
    });
    const balanceData = await res.json();
    if (!balanceData?.success) {
      throw new Error(balanceData?.message);
    }
    console.log(balanceData?.data);

    return {
      success: true,
      message: "User balance updated successfully.",
    };
  } catch (error) {
    throw error;
  }
}

