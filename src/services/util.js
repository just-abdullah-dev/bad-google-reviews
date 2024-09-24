'use server';

import { revalidateTag } from "next/cache";

export async function revalidateTagFunc(tag){
  revalidateTag(tag)
}