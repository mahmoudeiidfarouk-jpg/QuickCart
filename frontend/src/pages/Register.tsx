import { useState } from "react";
import {
    ArrowRight,
    Lock,
    Mail,
    User,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const { login } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                "/auth/register",
                {
                    name,
                    email,
                    password,
                }
            );

            const { token, user } = response.data;

            login(token, user);

            window.location.href = "/";

        } catch (error: any) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to create account."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <span className="auth-label">
                        Create Account
                    </span>

                    <h1>
                        Join QuickCart
                    </h1>

                    <p>
                        Create your account and start shopping.
                    </p>

                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="name">
                            Name
                        </label>

                        <div className="input-wrapper">

                            <User size={18} />

                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                required
                                minLength={3}
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <div className="input-wrapper">

                            <Mail size={18} />

                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="input-wrapper">

                            <Lock size={18} />

                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                                minLength={8}
                            />

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"
                        }

                        {!loading && (
                            <ArrowRight size={18} />
                        )}
                    </button>

                </form>

                <div className="auth-footer">

                    <span>
                        Already have an account?
                    </span>

                    <a href="/login">
                        Sign In
                    </a>

                </div>

            </div>

        </div>
    );
};

export default Register;