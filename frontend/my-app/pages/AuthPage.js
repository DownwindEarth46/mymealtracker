import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"

  // Sign in fields
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInShowPw, setSignInShowPw] = useState(false);

  // Sign up fields
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirm, setSignUpConfirm] = useState("");
  const [signUpShowPw, setSignUpShowPw] = useState(false);

  const [error, setError] = useState("");

  const handleSignIn = () => {
    setError("");
    if (!signInEmail.trim() || !signInPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    // TODO: replace with real auth
    onAuth({ email: signInEmail, name: signInEmail.split("@")[0] });
  };

  const handleSignUp = () => {
    setError("");
    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (signUpPassword !== signUpConfirm) {
      setError("Passwords don't match.");
      return;
    }
    if (signUpPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    // TODO: replace with real auth
    onAuth({ email: signUpEmail, name: signUpName });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero ── */}
          <View style={styles.hero}>
            <View style={styles.logoRing}>
              <Text style={styles.logoEmoji}>🥗</Text>
            </View>
            <Text style={styles.appName}>NutriTrack</Text>
            <Text style={styles.tagline}>Know what you eat. Feel the difference.</Text>
          </View>

          {/* ── Card ── */}
          <View style={styles.card}>
            {/* Tab switcher */}
            <View style={styles.tabs}>
              {["signin", "signup"].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.tab, mode === t && styles.tabActive]}
                  onPress={() => { setMode(t); setError(""); }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, mode === t && styles.tabTextActive]}>
                    {t === "signin" ? "Sign In" : "Sign Up"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Error */}
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠ {error}</Text>
              </View>
            ) : null}

            {/* ── Sign In Form ── */}
            {mode === "signin" && (
              <View style={styles.form}>
                <Field
                  label="Email"
                  placeholder="you@example.com"
                  value={signInEmail}
                  onChangeText={setSignInEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <PasswordField
                  label="Password"
                  placeholder="Your password"
                  value={signInPassword}
                  onChangeText={setSignInPassword}
                  show={signInShowPw}
                  onToggleShow={() => setSignInShowPw((v) => !v)}
                />

                <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleSignIn}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>Sign In →</Text>
                </TouchableOpacity>

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.ghostBtn}
                  onPress={() => { setMode("signup"); setError(""); }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.ghostBtnText}>Create an account</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ── Sign Up Form ── */}
            {mode === "signup" && (
              <View style={styles.form}>
                <Field
                  label="Full Name"
                  placeholder="Jane Doe"
                  value={signUpName}
                  onChangeText={setSignUpName}
                  autoCapitalize="words"
                />
                <Field
                  label="Email"
                  placeholder="you@example.com"
                  value={signUpEmail}
                  onChangeText={setSignUpEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <PasswordField
                  label="Password"
                  placeholder="At least 6 characters"
                  value={signUpPassword}
                  onChangeText={setSignUpPassword}
                  show={signUpShowPw}
                  onToggleShow={() => setSignUpShowPw((v) => !v)}
                />
                <PasswordField
                  label="Confirm Password"
                  placeholder="Repeat your password"
                  value={signUpConfirm}
                  onChangeText={setSignUpConfirm}
                  show={signUpShowPw}
                  onToggleShow={() => setSignUpShowPw((v) => !v)}
                />

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleSignUp}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>Create Account →</Text>
                </TouchableOpacity>

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.ghostBtn}
                  onPress={() => { setMode("signin"); setError(""); }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.ghostBtnText}>Already have an account? Sign in</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={styles.legalText}>
            By continuing you agree to our Terms of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Reusable field components ────────────────────────────────────────────────

const Field = ({ label, placeholder, value, onChangeText, keyboardType, autoCapitalize }) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || "default"}
      autoCapitalize={autoCapitalize || "none"}
      autoCorrect={false}
    />
  </View>
);

const PasswordField = ({ label, placeholder, value, onChangeText, show, onToggleShow }) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.pwRow}>
      <TextInput
        style={[styles.input, { flex: 1, marginBottom: 0 }]}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!show}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.eyeBtn} onPress={onToggleShow} activeOpacity={0.7}>
        <Text style={styles.eyeText}>{show ? "🙈" : "👁️"}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#6366f1",
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  // Hero
  hero: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
  },
  logoEmoji: {
    fontSize: 38,
  },
  appName: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  tagline: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },

  // Card
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 28,
    padding: 24,
    shadowColor: "#3730a3",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  // Tabs
  tabs: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#6366f1",
    shadowColor: "#6366f1",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94a3b8",
  },
  tabTextActive: {
    color: "#fff",
  },

  // Error
  errorBox: {
    backgroundColor: "#fef2f2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: "#ef4444",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    fontWeight: "600",
  },

  // Form
  form: {
    gap: 4,
  },
  fieldWrapper: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#1e1b4b",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
  },
  pwRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eyeBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  eyeText: {
    fontSize: 16,
  },

  // Forgot
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 6,
    marginTop: -6,
  },
  forgotText: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "600",
  },

  // Buttons
  primaryBtn: {
    backgroundColor: "#6366f1",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
    shadowColor: "#6366f1",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  ghostBtn: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  ghostBtnText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "700",
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },

  // Legal
  legalText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    marginTop: 20,
    marginHorizontal: 32,
    lineHeight: 16,
  },
});
