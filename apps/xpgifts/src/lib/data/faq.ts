export type FaqItem = {
	question: string;
	answer: string;
	category: string;
};

const faqs: FaqItem[] = [
	{
		category: "Customer Service",
		question: "How can I contact you?",
		answer:
			"We're easy to reach and typically respond within 5-15 minutes during our Eastern Time hours (9:00 AM-6:00 PM). Reach out any time from our Contact page.",
	},
	{
		category: "Customer Service",
		question: "What's the shirt material like?",
		answer:
			'Fabric details are listed on the "Fabric" tab on every product page.',
	},
	{
		category: "Customer Service",
		question: "How should I wash and dry my shirt?",
		answer:
			"Wash inside-out on your washer's standard setting. We recommend hang drying for best results, though a regular dryer works fine too - shrinking is minimal and our prints won't fade.",
	},
	{
		category: "Customer Service",
		question: "Where can I find sizing information?",
		answer:
			'Sizing details are listed on the "Sizes" tab on every product page.',
	},
	{
		category: "Customer Service",
		question: "Do you have a physical store?",
		answer: "No, we're exclusively an online store.",
	},
	{
		category: "Customer Service",
		question: 'What does "custom printed" mean?',
		answer:
			"Every product is printed to order - once you place an order, a blank item is sent to our printer and made especially for you. This requires 3-5 days of processing for printing and quality assurance.",
	},
	{
		category: "Customer Service",
		question: "What currency are your prices listed in?",
		answer:
			"All prices are listed in USD, and orders are placed in USD even if you switch the displayed currency.",
	},
	{
		category: "Payments & Discounts",
		question: "Can I use two coupons in the same order?",
		answer: "Unfortunately not - our policy allows one coupon per order.",
	},
	{
		category: "Payments & Discounts",
		question: "Why was my credit card declined?",
		answer:
			"This can happen for a few reasons - double check that all fields and your billing address exactly match what's on file with your bank. If it's still declined, contact your card issuer; for privacy reasons, we're given very little detail about the reason for a decline.",
	},
	{
		category: "Payments & Discounts",
		question: "How is my payment information stored?",
		answer:
			"We take privacy and security seriously - any payment information you choose to save is stored using industry-standard 256-bit encryption.",
	},
	{
		category: "Accounts & Login",
		question: "How do I change my password?",
		answer:
			"If you're logged in, you can update it from your account settings. If you're logged out and don't remember your password, use the password recovery page to reset it.",
	},
	{
		category: "Accounts & Login",
		question: "How do I recover my password?",
		answer:
			"If you're logged out and don't remember your password, use the password recovery page to reset it. If you're already logged in, you can change it from your account settings instead.",
	},
	{
		category: "My Order",
		question: "I placed an order and haven't received a tracking code.",
		answer:
			"Totally normal - every order is custom made, so tracking codes aren't sent immediately. Allow 3-5 business days; once your item is made, a tracking code is emailed to you automatically.",
	},
	{
		category: "My Order",
		question: "I entered the wrong shipping address. What should I do?",
		answer:
			"Get in touch as soon as possible - ideally within 24 hours of ordering. If we haven't shipped your order yet, we can update the address for you.",
	},
	{
		category: "My Order",
		question: "I ordered the wrong size. What should I do?",
		answer:
			"Get in touch as soon as possible - ideally within 24 hours. If we haven't started printing yet, we can update the size for you.",
	},
	{
		category: "My Order",
		question: "Can I cancel my order?",
		answer:
			"Get in touch as soon as possible - ideally within 24 hours. If we haven't made or shipped your order yet, we can cancel it for you.",
	},
	{
		category: "Shipping",
		question: "How long will it take to receive my order?",
		answer:
			"After fulfillment, on average: United States 3-5 business days, United Kingdom 8-12 business days, Australia 12-15 business days, and the rest of the world 15-20 business days.",
	},
	{
		category: "Shipping",
		question: "Do you ship internationally?",
		answer: "Yes - we ship to every country.",
	},
	{
		category: "Shipping",
		question: "How much does shipping cost?",
		answer:
			"Shipping cost depends on your order's total weight, destination, and delivery speed (standard or expedited). Add an item to your cart and start checkout to see the exact rate for your address.",
	},
	{
		category: "Shipping",
		question: "How do I track the status of my order?",
		answer:
			"Once your order ships, a tracking code is emailed to you automatically. You can also check the latest status any time from My Account → Orders.",
	},
	{
		category: "Shipping",
		question: "What happens if my package is returned to you?",
		answer:
			"Packages that fail to deliver or are refused come back to us more slowly than outbound deliveries, so returns can take a while to process. Refusable items are refunded minus the original and return shipping cost; non-refundable items aren't refunded, and we'll reach out to arrange next steps. If a package fails to deliver due to an address issue, we'll contact you to correct it and reship.",
	},
	{
		category: "Returns & Refunds",
		question: "How do I return or exchange an item?",
		answer:
			"Contact us first to confirm the right next step. Our policy lasts 30 days from the original purchase date, and returns or refunds are only issued for items that arrive wrong or damaged - your item must be unused and in the condition you received it. Shipping costs are non-refundable and are deducted from any refund, and sale items are final.",
	},
	{
		category: "Returns & Refunds",
		question: "Do you offer refunds?",
		answer:
			"Refunds are only offered for items that arrive wrong or damaged. If that happens, contact us and we'll issue your refund within 1-2 business days.",
	},
	{
		category: "Returns & Refunds",
		question: "My shirt doesn't fit. Can I exchange it for a new size?",
		answer:
			"Yes, one size exchange is available per order within 30 days of your original purchase date, as long as the item is unused and in the condition you received it. Contact us for instructions.",
	},
	{
		category: "Returns & Refunds",
		question: "My order never arrived. What should I do?",
		answer:
			"Don't stress - first check for a \"delivery exception\" on your tracking code and allow 1-3 days past the expected delivery date. If it still hasn't shown up, check with your local post office, then contact us and we'll look into it.",
	},
	{
		category: "Returns & Refunds",
		question: "I received a defective or damaged item.",
		answer:
			"We're sorry to hear that - send us a photo of the issue so we can verify it and make it right, either a replacement or a refund. We'll ship a replacement with expedited shipping at no extra cost, and you won't need to return the damaged item.",
	},
];

export function getFaqs(): FaqItem[] {
	return faqs;
}
