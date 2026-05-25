export default function LoginForm({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onLogin,
}) {
  return (
    <form onSubmit={onLogin}>
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
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
