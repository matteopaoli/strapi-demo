import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

const modelToPageMap: Record<string, string> = {
    article: "/blog",
}

export async function POST(request: NextRequest, {  }) {
    const body = await request.json()

    const model = body.model ?? 'article' as string;
    console.log(body)
    console.log(modelToPageMap[model])
    revalidatePath(`/[lang]${modelToPageMap[model]}`, 'layout')

    return Response.json({ ok: 'ok' })

    // if (token === process.env.REVALIDATE_API_TOKEN && slug) {
    //     revalidatePath(slug, 'page')
    //     return Response.json({ ok: 'ok' })
    // }
    // return Response.json({ error: 'invalid token' }, { status: 401 })
}