'use client';

import React, { useState } from 'react';

// --- Helper Components (Copied from Sign In) ---

const Label = ({ htmlFor, children, className }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${className}`}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

const Button = React.forwardRef(({ className, variant, type = 'button', children, disabled, ...props }, ref) => {
    // Note: Tailwind theme variables are used here (primary, foreground, background, etc.)
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
    
    let variantStyles = '';
    if (variant === 'outline') {
        variantStyles = 'border border-foreground bg-background hover:bg-accent hover:text-accent-foreground';
    } else {
        variantStyles = 'bg-primary text-primary-foreground hover:bg-primary/90';
    }

    return (
        <button
            ref={ref}
            className={`${baseStyles} ${variantStyles} ${className}`}
            type={type}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
});
Button.displayName = "Button";


const Select = ({ value, onValueChange, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleSelect = (newValue) => {
        onValueChange(newValue);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {children[0]}
            </div>
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 overflow-hidden rounded-md border border-border bg-white text-popover-foreground">
                    {React.Children.map(children[1], child => 
                        React.cloneElement(child, {
                            onClick: () => handleSelect(child.props.value),
                            selectedValue: value
                        })
                    )}
                </div>
            )}
        </div>
    );
};

const SelectTrigger = ({ className, children }) => (
    <div className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors [&>span]:line-clamp-1 ${className}`}>
        {children}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 opacity-50"><path d="m6 9 6 6 6-6"/></svg>
    </div>
);

const SelectValue = ({ text, placeholder }) => (
    <span className="pointer-events-none">
        {text || placeholder || "Select an option"}
    </span>
);

const SelectContent = ({ children }) => <>{children}</>;

const SelectItem = ({ value, children, onClick, selectedValue }) => (
    <div 
        onClick={onClick}
        className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${selectedValue === value ? 'font-semibold bg-accent' : 'hover:bg-accent'}`}
    >
        {children}
    </div>
);

const Link = ({ href, className, children }) => (
    <a href={href} className={className}>
        {children}
    </a>
);


// --- Main Component ---

export default function App() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [label, setLabel] = useState('experience_seeker'); // Default to a value
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        console.error("Passwords do not match.");
        // In a real app, you would show a user-friendly error message in the UI
        return; 
    }
    setIsLoading(true);
    console.log('Attempting sign up:', { fullName, email, label });

    // Simulate API call delay
    setTimeout(() => {
        setIsLoading(false);
        console.log('Sign up attempt finished.');
    }, 1500);
  };

  // Determine the display value for the Select component
  const getLabelText = (val) => {
    switch (val) {
        case 'experience_seeker': return 'Experience Seeker';
        case 'event_organiser': return 'Event Organiser';
        case 'moderator': return 'Moderator';
        default: return 'Select an account type';
    }
  };


  return (
    // Outer container for centering
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans">
      
      {/* Main form container: border-foreground (black) applied, rounded corners */}
      <div className="w-full max-w-sm p-6 bg-white rounded-xl border border-foreground">
        
        {/* Centered Logo and FOMO text */}
        <div className="flex flex-col items-center mb-6">
            {/* Replaced image input with a static img tag */}
            <img 
                src="https://via.placeholder.com/64x64.png?text=Logo" // Placeholder image URL
                alt="Logo" 
                className="w-16 h-16 object-cover rounded-xl"
            />
            <h1 className="text-foreground text-4xl mt-3 font-normal">FOMO</h1>
        </div>

        {/* Sign Up text */}
        <h3 className="text-2xl font-normal text-foreground mb-8">Sign Up</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-foreground">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* 2. Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* 3. Account Type (Label) */}
          <div className="space-y-2">
            <Label htmlFor="label" className="text-foreground">
              Account Type
            </Label>
            <Select value={label} onValueChange={setLabel}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue text={getLabelText(label)} placeholder="Select an account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="experience_seeker">Experience Seeker</SelectItem>
                <SelectItem value="event_organiser">Event Organiser</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4. Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* 5. Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          {/* Already have an account? Link - Adjusted font-medium for full consistency */}
          <div className="text-left pt-2">
            <p className="text-muted-foreground text-sm font-medium">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-foreground hover:underline transition-colors">
                    Log In
                </Link>
            </p>
          </div>
          

          {/* Sign Up Button (Styles matched to Google button for consistency, text-foreground is black) */}
          <Button
            type="submit"
            disabled={isLoading || password !== confirmPassword || !password}
            className="w-full border-foreground bg-white text-foreground hover:bg-gray-50 hover:text-foreground transition-colors"
            variant="outline" 
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing Up...
              </>
            ) : "Sign Up"}
          </Button>

          {/* OR Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted-foreground">OR</span>
            </div>
          </div>

          {/* Continue With Google Button (Google logo black) */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-foreground bg-white text-foreground hover:bg-gray-50 hover:text-foreground transition-colors"
          >
            {/* Google Logo SVG - Set to text-foreground (black) */}
            <svg className="w-5 h-5 mr-2 text-foreground" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue With Google
          </Button>
        </form>
      </div>
    </div>
  );
}
