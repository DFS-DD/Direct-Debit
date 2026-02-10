import React, { useState, useEffect } from 'react';
import { Check, Star, Calendar, ChevronDown, AlertCircle } from 'lucide-react';

// --- Configuration Data ---
// EDIT THIS ARRAY TO MATCH YOUR SPECIFIC FORM QUESTIONS
const FORM_CONFIG = {
  title: "Event Registration & Feedback",
  description: "Please fill out this form to register for the upcoming workshop. We value your input to help us plan better.",
  themeColor: "bg-[#03787c]", // The specific teal used in MS Forms
  themeColorHex: "#03787c",
  questions: [
    {
      id: 1,
      type: "text",
      title: "Full Name",
      required: true,
      placeholder: "Enter your name"
    },
    {
      id: 2,
      type: "email",
      title: "Email Address",
      required: true,
      placeholder: "name@example.com"
    },
    {
      id: 3,
      type: "radio",
      title: "Will you be attending the networking lunch?",
      required: true,
      options: ["Yes, I will attend", "No, I cannot attend", "Maybe / Unsure"]
    },
    {
      id: 4,
      type: "checkbox",
      title: "Which sessions are you interested in? (Select all that apply)",
      required: false,
      options: ["Keynote Speech", "Technical Workshop", "Panel Discussion", "Q&A Session"]
    },
    {
      id: 5,
      type: "date",
      title: "Preferred Date",
      required: true
    },
    {
      id: 6,
      type: "rating",
      title: "How likely are you to recommend our events to a colleague?",
      required: true,
      maxRating: 5
    },
    {
      id: 7,
      type: "longText",
      title: "Any dietary restrictions or special requests?",
      required: false,
      placeholder: "Enter your answer"
    }
  ]
};

// --- Components ---

const Header = ({ title, description }) => (
  <div className="bg-white rounded-t-lg border-t-4 border-[#03787c] shadow-sm p-6 mb-4 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-2 bg-[#03787c]"></div> 
    {/* Optional: Add an image banner logic here if needed */}
    <h1 className="text-3xl font-semibold text-gray-900 mb-2 font-sans tracking-tight">{title}</h1>
    <div className="text-base text-gray-600 font-sans leading-relaxed whitespace-pre-line">
      {description}
    </div>
    <div className="mt-4 text-xs text-red-600 flex items-center">
      <span className="mr-1">*</span> Required
    </div>
  </div>
);

const QuestionContainer = ({ children, isError }) => (
  <div className={`bg-white rounded-lg shadow-sm p-6 mb-4 transition-all duration-200 border-l-4 ${isError ? 'border-red-600' : 'border-transparent hover:border-gray-300'}`}>
    {children}
  </div>
);

const Label = ({ title, required, index }) => (
  <div className="mb-3">
    <label className="block text-base font-medium text-gray-900 leading-snug">
      <span className="mr-1">{index}.</span>
      {title}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="flex items-center mt-2 text-xs text-red-600">
    <AlertCircle size={14} className="mr-1" />
    {message}
  </div>
);

// --- Input Components ---

const TextInput = ({ value, onChange, placeholder, type = "text", onBlur }) => (
  <input
    type={type}
    className="w-full border-b border-gray-400 bg-transparent py-2 px-1 text-gray-900 focus:outline-none focus:border-[#03787c] focus:border-b-2 transition-colors placeholder-gray-500"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
  />
);

const LongTextInput = ({ value, onChange, placeholder, onBlur }) => (
  <textarea
    className="w-full border-b border-gray-400 bg-transparent py-2 px-1 text-gray-900 focus:outline-none focus:border-[#03787c] focus:border-b-2 transition-colors placeholder-gray-500 min-h-[80px] resize-y"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
  />
);

const RadioGroup = ({ options, value, onChange, name }) => (
  <div className="space-y-3 mt-2">
    {options.map((option, idx) => (
      <label key={idx} className="flex items-center cursor-pointer group">
        <div className="relative flex items-center justify-center w-5 h-5 mr-3">
          <input
            type="radio"
            name={name}
            className="peer appearance-none w-5 h-5 border-2 border-gray-500 rounded-full checked:border-[#03787c] group-hover:border-[#03787c]"
            checked={value === option}
            onChange={() => onChange(option)}
          />
          <div className="absolute w-2.5 h-2.5 bg-[#03787c] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
        </div>
        <span className="text-gray-800">{option}</span>
      </label>
    ))}
  </div>
);

const CheckboxGroup = ({ options, value = [], onChange }) => {
  const handleChange = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="space-y-3 mt-2">
      {options.map((option, idx) => (
        <label key={idx} className="flex items-center cursor-pointer group">
          <div className="relative flex items-center justify-center w-5 h-5 mr-3">
            <input
              type="checkbox"
              className="peer appearance-none w-5 h-5 border-2 border-gray-500 rounded-sm checked:bg-[#03787c] checked:border-[#03787c] group-hover:border-[#03787c] transition-colors"
              checked={value.includes(option)}
              onChange={() => handleChange(option)}
            />
            <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
          </div>
          <span className="text-gray-800">{option}</span>
        </label>
      ))}
    </div>
  );
};

const DateInput = ({ value, onChange, onBlur }) => (
  <div className="relative max-w-xs">
    <input
      type="date"
      className="w-full border-b border-gray-400 bg-transparent py-2 px-1 text-gray-900 focus:outline-none focus:border-[#03787c] focus:border-b-2 transition-colors placeholder-gray-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
    <Calendar size={18} className="absolute right-2 top-2.5 text-gray-500 pointer-events-none" />
  </div>
);

const RatingInput = ({ maxRating = 5, value, onChange }) => {
  return (
    <div className="flex items-center space-x-2 mt-2">
      {[...Array(maxRating)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(ratingValue)}
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#03787c] focus:ring-offset-1
              ${value >= ratingValue 
                ? `bg-[#03787c] border-[#03787c] text-white shadow-md` 
                : 'bg-white border-gray-300 text-gray-600 hover:border-[#03787c] hover:text-[#03787c]'
              }`}
          >
            <span className="font-semibold">{ratingValue}</span>
          </button>
        );
      })}
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    
    // Clear error if value is provided
    if (errors[id]) {
        // Simple check: if text/array is not empty
        const isValid = Array.isArray(value) ? value.length > 0 : !!value;
        if (isValid) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    }
  };

  const handleBlur = (id) => {
    setTouched((prev) => ({ ...prev, [id]: true }));
    // Optional: Validate on blur
    const question = FORM_CONFIG.questions.find(q => q.id === id);
    if (question.required && (!formData[id] || (Array.isArray(formData[id]) && formData[id].length === 0))) {
        setErrors(prev => ({...prev, [id]: 'This question is required.'}));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    FORM_CONFIG.questions.forEach((q) => {
      if (q.required) {
        const val = formData[q.id];
        if (!val || (Array.isArray(val) && val.length === 0)) {
          newErrors[q.id] = "This question is required.";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(FORM_CONFIG.questions.reduce((acc, q) => ({ ...acc, [q.id]: true }), {}));

    if (validateForm()) {
      setSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setSubmitting(false);
        setIsSubmitted(true);
        console.log("Form Submitted:", formData);
      }, 1500);
    } else {
        // Scroll to first error
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] font-sans flex items-center justify-center p-4">
        <div className="w-full max-w-[640px] bg-white rounded-lg shadow-sm p-8 text-center border-t-4 border-[#03787c] relative">
           <div className="absolute top-0 left-0 w-full h-1 bg-[#03787c]"></div>
           
           <div className="mb-6 flex justify-center">
             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={32} className="text-green-600" />
             </div>
           </div>
           
           <h2 className="text-2xl font-semibold text-gray-900 mb-2">Thanks!</h2>
           <p className="text-gray-600 mb-8">Your response was submitted.</p>
           
           <div className="text-sm text-blue-600 font-medium hover:underline cursor-pointer" onClick={() => window.location.reload()}>
             Submit another response
           </div>

           <div className="mt-12 text-xs text-gray-400">
             Privacy & Cookies &bull; Terms of use
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] font-sans pb-16">
        {/* Top Decorative Bar */}
        <div className="w-full h-[50px] bg-[#03787c] absolute top-0 left-0 z-0"></div>

        <div className="relative z-10 w-full max-w-[640px] mx-auto pt-8 px-4 sm:px-0">
            <form onSubmit={handleSubmit}>
                <Header 
                    title={FORM_CONFIG.title} 
                    description={FORM_CONFIG.description} 
                />

                {FORM_CONFIG.questions.map((q, index) => (
                    <QuestionContainer key={q.id} isError={!!errors[q.id]}>
                        <Label 
                            title={q.title} 
                            required={q.required} 
                            index={index + 1} 
                        />
                        
                        <div className="mt-2">
                            {q.type === 'text' && (
                                <TextInput 
                                    value={formData[q.id] || ''} 
                                    onChange={(val) => handleInputChange(q.id, val)} 
                                    placeholder={q.placeholder}
                                    onBlur={() => handleBlur(q.id)}
                                />
                            )}
                            {q.type === 'email' && (
                                <TextInput 
                                    value={formData[q.id] || ''} 
                                    onChange={(val) => handleInputChange(q.id, val)} 
                                    placeholder={q.placeholder}
                                    type="email"
                                    onBlur={() => handleBlur(q.id)}
                                />
                            )}
                            {q.type === 'longText' && (
                                <LongTextInput 
                                    value={formData[q.id] || ''} 
                                    onChange={(val) => handleInputChange(q.id, val)} 
                                    placeholder={q.placeholder}
                                    onBlur={() => handleBlur(q.id)}
                                />
                            )}
                            {q.type === 'radio' && (
                                <RadioGroup 
                                    name={`q-${q.id}`}
                                    options={q.options} 
                                    value={formData[q.id]} 
                                    onChange={(val) => handleInputChange(q.id, val)} 
                                />
                            )}
                            {q.type === 'checkbox' && (
                                <CheckboxGroup 
                                    options={q.options} 
                                    value={formData[q.id]} 
                                    onChange={(val) => handleInputChange(q.id, val)} 
                                />
                            )}
                            {q.type === 'date' && (
                                <DateInput 
                                    value={formData[q.id] || ''} 
                                    onChange={(val) => handleInputChange(q.id, val)} 
                                    onBlur={() => handleBlur(q.id)}
                                />
                            )}
                            {q.type === 'rating' && (
                                <RatingInput 
                                    value={formData[q.id]} 
                                    onChange={(val) => handleInputChange(q.id, val)}
                                    maxRating={q.maxRating}
                                />
                            )}
                        </div>

                        {errors[q.id] && <ErrorMessage message={errors[q.id]} />}
                    </QuestionContainer>
                ))}

                <div className="mt-8 mb-12">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#03787c] text-white font-semibold py-2 px-6 rounded-sm shadow-sm hover:bg-[#025f62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03787c] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                    <div className="mt-4 text-xs text-gray-500">
                        Never give out your password. Report abuse
                    </div>
                </div>
            </form>
        </div>
    </div>
  );
}

