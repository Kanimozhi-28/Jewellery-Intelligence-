// Helper function to group sessions by customer for better display
export const groupSessionsByCustomer = (sessions) => {
    const grouped = {};

    sessions.forEach(session => {
        const customerId = session.customer_id || (session.customer && session.customer.id);

        if (!customerId) return;

        if (!grouped[customerId]) {
            grouped[customerId] = {
                customer: session.customer,
                sessions: [],
                allDetails: []
            };
        }

        grouped[customerId].sessions.push(session);

        // Collect all jewel details from this session
        if (session.details && session.details.length > 0) {
            grouped[customerId].allDetails.push(...session.details);
        }
    });

    return Object.values(grouped);
};
