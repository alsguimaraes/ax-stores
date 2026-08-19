import { getFaqs } from "$lib/data/faq";

export function load() {
	const faqs = getFaqs();
	const categories = [...new Set(faqs.map((faq) => faq.category))];
	return { faqs, categories };
}
