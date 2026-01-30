export const MOCK_DATA = {
    "/auth/login": {
        user: {
            id: "mock_user_123",
            name: "Dev User",
            email: "dev@example.com",
            phone: "9876543210",
            subscription: "free"
        },
        token: "mock_jwt_token"
    },
    "/practice/questions": {
        questions: [
            {
                _id: "q1",
                question: "What is the capital of France?",
                options: [{ key: "A", text: "London" }, { key: "B", text: "Paris" }, { key: "C", text: "Berlin" }],
                correctAnswer: "B",
                explanation: "Paris is the capital of France."
            },
            {
                _id: "q2",
                question: "Which planet is known as the Red Planet?",
                options: [{ key: "A", text: "Earth" }, { key: "B", text: "Mars" }, { key: "C", text: "Jupiter" }],
                correctAnswer: "B",
                explanation: "Mars appears red due to iron oxide."
            }
        ],
        hasMore: false
    },
    "/mock/start": {
        mockTestId: "mock_test_001",
        questions: [
            {
                _id: "mq1",
                question: "Mock Question 1: React Native uses which language?",
                options: ["Java", "Swift", "JavaScript", "Python"],
                subject: "Mobile Dev"
            },
            {
                _id: "mq2",
                question: "Mock Question 2: What is JSX?",
                options: ["JavaScript XML", "Java Syntax Extension", "JSON Xylophone", "None"],
                subject: "Mobile Dev"
            }
        ]
    },
    "/user/profile": {
        id: "mock_user_123",
        name: "Dev User",
        email: "dev@example.com",
        phone: "9876543210",
        subscription: "premium",
        subscriptionEnd: "2025-12-31T23:59:59.999Z",
        referralCode: "DEV123",
        referralCount: 5,
        referralEarnings: 500
    },
    "/challenges/create": {
        message: "Challenge created",
        challengeId: "ch_123",
        code: "MOCK12"
    },
    "/challenges/join": {
        message: "Joined successfully",
        challengeId: "ch_123",
        questions: []
    },
    "/dashboard/summary": {
        totalQuestions: 150,
        accuracy: 85,
        streak: 7,
        timeSpent: 1200,
        topicPerformance: [
            { x: "Math", y: 70 },
            { x: "Science", y: 90 },
            { x: "History", y: 60 }
        ]
    }
};
