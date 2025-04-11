import { useState } from "react";

// Component for creating a new user account
const CreateAccountPage = () => {
  // Stores form input values for name, email, and password
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // State to track any error messages
  const [error, setError] = useState<string | null>(null);

  // State to track if account was successfully created
  const [success, setSuccess] = useState(false);

  // Handles input changes and updates form state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields are filled
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Send POST request to register endpoint
      const response = await fetch("https://localhost:5000/api/Auth/Register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Throw error if request failed
      if (!response.ok) {
        throw new Error("Registration failed.");
      }

      // If successful, show success message
      setSuccess(true);
      setError(null);
    } catch (err) {
      // Set error message from caught error
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <h2>Create Account</h2>

      {/* Display error message if present */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Show success message if account was created */}
      {success ? (
        <p>Account created successfully!</p>
      ) : (
        // Account creation form
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </label>
          <br />
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>
          <br />
          <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </label>
          <br />
          <button type="submit">Create Account</button>
        </form>
      )}
    </div>
  );
};

export default CreateAccountPage;
