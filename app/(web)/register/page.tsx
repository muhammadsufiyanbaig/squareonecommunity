"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CheckIcon, CircleX, Cross, Eye, EyeOff } from "lucide-react";
import axiosInstance from "@/app/axiosInstanse";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/app/components/Spinner";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errormsg, setErrorMsg] = useState(null);

  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const criteria = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return criteria.test(password);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordValid(validatePassword(newPassword));
    setFormData({ ...formData, password: newPassword });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailValid(isValidEmail(newEmail));
    setFormData({ ...formData, email: newEmail });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    setErrorMsg(null);
    if (!validatePassword(password) || !isValidEmail(email)) {
      setPasswordValid(validatePassword(password));
      setEmailValid(isValidEmail(email));
      return;
    }

    if (!formData.fullName || !formData.email || !formData.password) {
      alert("Please fill in all fields before submitting");
      return;
    }
    try {
      const response = await axiosInstance.post("/admin/auth/signup", formData);
      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Admin created successfully",
          description: (
            <div className="flex items-center">
              <span className="text-green-500 border border-green-500 rounded-full p-1 mr-2">
                <CheckIcon className="h-4 w-4" />
              </span>
              <span className="first-letter:capitalize">
                Admin created successfully
              </span>
            </div>
          ),
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);
      const errorMsg =
        error.response?.data?.message || "An error occurred during signup";
      setErrorMsg(errorMsg);
      toast({
        title: "Somthing went wrong",
        description: (
          <div className="flex items-center">
            <CircleX className="h-4 w-4 text-red-500 mr-2" />
            <span className="first-letter:capitalize">
              {errorMsg}
            </span>
          </div>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-theme">
      <div className="flex items-center justify-center p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px] border px-3 py-6 rounded-xl">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-red-700">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter infornation below to create your account
            </p>
          </div>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <div className="grid grid-rows-3 gap-2">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      type="text"
                      name="fullName"
                      autoCapitalize="none"
                      autoComplete="text"
                      autoCorrect="off"
                      required
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      name="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                    {!emailValid && (
                      <p className="text-red-500 text-xs mt-1">
                        Invalid email address
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="pass">Password</Label>
                    <div className="relative">
                      <Input
                        id="pass"
                        placeholder="*****"
                        type={showPassword ? "text" : "password"}
                        autoCapitalize="none"
                        name="password"
                        autoComplete="text"
                        autoCorrect="off"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                        {showPassword ? (
                          <Eye className="h-5 w-5" />
                        ) : (
                          <EyeOff className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {!passwordValid && (
                      <p className="text-red-500 text-xs mt-1">
                        Password does not meet criteria
                      </p>
                    )}
                  </div>

                  <div id="passwordCriteria" className="text-sm space-y-2">
                    <p className="">Password Must contain:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>At least 1 uppercase</li>
                      <li>At least 1 number</li>
                      <li>At least 8 characters</li>
                    </ul>
                  </div>
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  {loading ? <Spinner /> : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
