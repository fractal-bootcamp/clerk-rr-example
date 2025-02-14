import type { Route } from "./+types/chatroom";
import { getAuth } from '@clerk/react-router/ssr.server'
import { createClerkClient } from '@clerk/react-router/api.server'
import { Form, redirect } from 'react-router'

const messages = [
    {
        id: 1,
        content: 'Hello, how are you?',
        sender: 'John Doe'
    }
]

// handles GET requests and loads the chatroom page
export async function loader(args: Route.LoaderArgs) {
    // console.log(messages)
    const { userId, getToken } = await getAuth(args)
    if (!userId) {
        return { username: 'Anonymous User', messages }
    }

    const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
    })

    const user = await clerkClient.users.getUser(userId)

    return { username: user.username || user.firstName || 'Anonymous User', messages }
}

// handle POST requests and form submissions
export async function action(args: Route.ActionArgs) {
    // Use `getAuth()` to get the user's ID
    const { userId, getToken } = await getAuth(args)
    // console.log('IN THE ACTION')

    // // Protect the route by checking if the user is signed in
    if (!userId) {
        return null
    }

    // Get the form data
    const formData = await args.request.formData()
    const message = formData.get('message')
    console.log(formData, message)

    // Instantiate the Backend SDK and get the user's full `Backend User` object
    const user = await createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
    }).users.getUser(userId)

    messages.push({
        id: messages.length + 1,
        content: message as string,
        sender: user.username || user.firstName || 'Anonymous User'
    })
    return { messages }
}

export default function Chatroom({ loaderData }: Route.ComponentProps) {
    const { username, messages } = loaderData

    return (
        <div className="container mx-auto px-4">
            <div className="flex flex-col h-64">
                <div className="bg-gray-100 p-4 rounded-t-lg">
                    <h1 className="text-xl font-bold">Welcome, {username}!</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className="flex flex-col">
                            <span className="text-sm text-gray-500">{message.sender}</span>
                            <p className="text-base">{message.content}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-100 p-4 rounded-b-lg">
                    <Form method="post" className="flex gap-2">
                        <input
                            type="text"
                            name="message"
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                        >
                            Send
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    )
}
