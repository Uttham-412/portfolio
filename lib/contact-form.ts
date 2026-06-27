export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const name = data.name.trim();
  const email = data.email.trim();
  const subject = data.subject.trim();
  const message = data.message.trim();

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (name.length > 100) {
    errors.name = "Name must be 100 characters or less.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  } else if (email.length > 254) {
    errors.email = "Email must be 254 characters or less.";
  }

  if (!subject) {
    errors.subject = "Subject is required.";
  } else if (subject.length < 3) {
    errors.subject = "Subject must be at least 3 characters.";
  } else if (subject.length > 200) {
    errors.subject = "Subject must be 200 characters or less.";
  }

  if (!message) {
    errors.message = "Message is required.";
  } else if (message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (message.length > 5000) {
    errors.message = "Message must be 5000 characters or less.";
  }

  return errors;
}

export function hasContactFormErrors(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
