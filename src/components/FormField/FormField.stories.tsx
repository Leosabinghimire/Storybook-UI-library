import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button/Button";
import { Checkbox } from "@/components/Checkbox/Checkbox";
import { PasswordInput } from "@/components/Input/PasswordInput";
import { TextInput } from "@/components/Input/TextInput";
import { Select } from "@/components/Select/Select";
import { FormField } from "./FormField";

const meta = {
  title: "Forms/FormField",
  component: FormField,
  parameters: {
    docs: {
      description: {
        component:
          "Wires a label, hint and error message to any control with the right ids and ARIA attributes. The inputs in this library use it internally; use it directly for custom controls.",
      },
    },
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj;

export const CustomControl: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <FormField label="Color" hint="Pick your accent color." required>
        {(field) => <input type="color" defaultValue="#4f62e6" {...field} style={{ width: 64, height: 40, border: "1px solid var(--ui-border-strong)", borderRadius: 8 }} />}
      </FormField>
    </div>
  ),
};

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  terms?: string;
}

function SignupForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {};
    if (!String(data.get("name")).trim()) next.name = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email")))) next.email = "Enter a valid email address.";
    if (String(data.get("password")).length < 8) next.password = "Password must be at least 8 characters.";
    if (!data.get("role")) next.role = "Choose a role.";
    if (!data.get("terms")) next.terms = "You must accept the terms.";
    setErrors(next);
    setSubmitted(Object.keys(next).length === 0);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="sb-col" style={{ maxWidth: 400 }}>
      <TextInput name="name" label="Full name" required error={errors.name} autoComplete="name" />
      <TextInput name="email" type="email" label="Email" required error={errors.email} hint="We will send a confirmation link." autoComplete="email" />
      <PasswordInput name="password" label="Password" required error={errors.password} autoComplete="new-password" />
      <Select
        name="role"
        label="Role"
        placeholder="Choose a role"
        required
        error={errors.role}
        options={[
          { value: "dev", label: "Developer" },
          { value: "design", label: "Designer" },
          { value: "pm", label: "Product manager" },
        ]}
      />
      <Checkbox name="terms" label="I agree to the terms of service" error={errors.terms} />
      <div className="sb-row">
        <Button type="submit">Create account</Button>
        {submitted && <span style={{ color: "var(--ui-success-text)", fontSize: "var(--ui-text-sm)" }}>Submitted ✓</span>}
      </div>
    </form>
  );
}

export const ValidationExample: Story = {
  render: () => <SignupForm />,
  parameters: { docs: { description: { story: "Submit the empty form to see every validation state. Errors are announced via `role=\"alert\"` and linked with `aria-describedby`." } } },
};
