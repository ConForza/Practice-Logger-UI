export default function LoginForm({
  authMode,
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onLogin,
  onRegister,
  onToggleMode,
}) {
  const isRegisterMode = authMode === "register";

  return (
    <section className="auth-card">
      <h2>{isRegisterMode ? "Create Account" : "Login"}</h2>

      <form onSubmit={isRegisterMode ? onRegister : onLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={onEmailChange} required />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={onPasswordChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading
            ? isRegisterMode
              ? "Creating account..."
              : "Logging in..."
            : isRegisterMode
              ? "Register"
              : "Login"}
        </button>
      </form>

      <button
        className="link-button"
        type="button"
        onClick={onToggleMode}
        disabled={loading}
      >
        {isRegisterMode
          ? "Already have an account? Login"
          : "Need an account? Register"}
      </button>
    </section>
  );
}
