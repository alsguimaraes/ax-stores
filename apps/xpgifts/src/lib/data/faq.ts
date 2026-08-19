export type FaqItem = {
	question: string;
	answer: string;
	category: string;
};

const faqs: FaqItem[] = [
	{
		category: "Orders",
		question: "How can I track my order?",
		answer:
			"Once your order ships, you'll receive a tracking link by email. You can also see the latest status any time from My Account → Orders.",
	},
	{
		category: "Orders",
		question: "Can I change or cancel my order after placing it?",
		answer:
			"We start personalizing items quickly, so changes can only be made within 2 hours of placing your order. Contact us right away and we'll do our best to help.",
	},
	{
		category: "Shipping",
		question: "How long does shipping take?",
		answer:
			"Most orders ship within 2-4 business days and arrive within 5-9 business days depending on your location.",
	},
	{
		category: "Shipping",
		question: "Do you ship internationally?",
		answer:
			"Yes, we ship to most countries. International orders may take 2-3 weeks and are subject to customs fees.",
	},
	{
		category: "Returns",
		question: "What is your return policy?",
		answer:
			"Because most items are personalized, we can only accept returns for items that arrive damaged or defective. See our Refund Policy for full details.",
	},
	{
		category: "Returns",
		question: "My item arrived damaged, what do I do?",
		answer:
			"Contact us within 14 days with a photo of the damaged item and we'll send a free replacement or refund.",
	},
	{
		category: "Products",
		question: "Can I customize the text or colors on an item?",
		answer:
			"Most products support custom names, dates, and text. Personalization options are shown on each product page before you add it to your cart.",
	},
	{
		category: "Products",
		question: "How do I know what size to order?",
		answer:
			"Each clothing product page includes a size chart in the description tab to help you pick the right fit.",
	},
];

export function getFaqs(): FaqItem[] {
	return faqs;
}
