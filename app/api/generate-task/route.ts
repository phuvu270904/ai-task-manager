export async function POST(req: Request) {
	try {
		const { title, description } = await req.json()

		if (!title || !description) {
			return new Response(
				JSON.stringify({ error: "Title and description are required" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			)
		}

		const prompt = `
Create a detailed task based on the following request:
Title: ${title}
Description: ${description}

Return the response in JSON format with the following structure:
{
  "title": "Enhanced task title",
  "description": "Detailed task description with action items and expected outcomes"
}
    `.trim()

		const response = await fetch(
			"https://openrouter.ai/api/v1/chat/completions",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model: "deepseek/deepseek-r1:free",
					messages: [
						{
							role: "user",
							content: prompt,
						},
					],
				}),
			}
		)

		if (!response.ok) {
			const errorText = await response.text()
			console.error("AI response error:", errorText)
			return new Response(JSON.stringify({ error: "AI generation failed" }), {
				status: 500,
				headers: { "Content-Type": "application/json" },
			})
		}

		const data = await response.json()

		// Extract message content from DeepSeek
		const aiMessage = data.choices?.[0]?.message?.content
		if (!aiMessage) {
			throw new Error("Invalid AI response format")
		}

    const cleanedMessage = aiMessage.replace(/```json|```/g, "").trim()

		const aiData = JSON.parse(cleanedMessage)

		return new Response(JSON.stringify(aiData), {
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		console.error("Error generating task:", error)
		return new Response(JSON.stringify({ error: "Failed to generate task" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		})
	}
}
