import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.CONTENT_API_KEY

    const url = `https://content.guardianapis.com/search?type=article&show-fields=headline,trailText,bodyText&page-size=10&api-key=${apiKey}`

    const res = await fetch(url)

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch Guardian" }, { status: 500 })
    }

    const data = await res.json()

    const articles = data.response.results.map((item: any, index: number) => ({
      id: index + 1,
      title: item.fields?.headline || item.webTitle,
      description: item.fields?.trailText || "",
      content: item.fields?.bodyText || "",
      section: item.sectionName,
      url: item.webUrl,
    }))

    return NextResponse.json({ articles })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
