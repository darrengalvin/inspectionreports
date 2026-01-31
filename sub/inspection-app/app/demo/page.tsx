'use client';

import { useState } from 'react';

export default function QuestionFormatsDemo() {
  // State for interactive demos
  const [slider, setSlider] = useState(5);
  const [dropdown, setDropdown] = useState('');
  const [textInput, setTextInput] = useState('');
  const [textarea, setTextarea] = useState('');
  const [radio, setRadio] = useState('');
  const [checkboxes, setCheckboxes] = useState<string[]>([]);
  const [toggle, setToggle] = useState(false);
  const [yesNoMaybe, setYesNoMaybe] = useState('');
  const [likert, setLikert] = useState('');
  const [rating, setRating] = useState(0);
  const [numberInput, setNumberInput] = useState('');
  const [multiSlider, setMultiSlider] = useState({ reliability: 5, respect: 5, safety: 5 });
  const [segmented, setSegmented] = useState('');

  const toggleCheckbox = (value: string) => {
    setCheckboxes(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-semibold text-neutral-900 mb-3">
            Question Format Options
          </h1>
          <p className="text-neutral-600">
            Visual reference for all available input types. Each can be configured per question.
          </p>
        </header>

        <div className="space-y-8">
          
          {/* 1. Slider */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Format 1</span>
                <h2 className="text-lg font-semibold text-neutral-900">Slider (1-10 Scale)</h2>
                <p className="text-sm text-neutral-500 mt-1">Best for: Ratings, scores, satisfaction levels</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Quantitative</span>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-5">
              <p className="text-neutral-800 font-medium mb-4">On a scale of 1-10, how supported do you feel here?</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-neutral-900">{slider}</span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    slider >= 7 ? 'bg-green-100 text-green-700' :
                    slider >= 4 ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {slider >= 7 ? 'Good' : slider >= 4 ? 'Moderate' : 'Poor'}
                  </span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={slider}
                  onChange={(e) => setSlider(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 
                           [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-neutral-900 
                           [&::-webkit-slider-thumb]:rounded-full"
                />
                
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>1 - Very Poor</span>
                  <span>5 - Average</span>
                  <span>10 - Excellent</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Dropdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Format 2</span>
                <h2 className="text-lg font-semibold text-neutral-900">Dropdown Select</h2>
                <p className="text-sm text-neutral-500 mt-1">Best for: Single choice from many options</p>
              </div>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Single Choice</span>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-5">
              <p className="text-neutral-800 font-medium mb-4">How often are staff meant to check in with you?</p>
              
              <select
                value={dropdown}
                onChange={(e) => setDropdown(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-800
                         bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <option value="">Select frequency...</option>
                <option value="daily">Daily</option>
                <option value="multiple">Multiple times per week</option>
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
                <option value="on-call">On-call only</option>
                <option value="24-7">24/7 on-site</option>
              </select>
            </div>
          </div>

          {/* 3. Text Input */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Format 3</span>
                <h2 className="text-lg font-semibold text-neutral-900">Short Text Input</h2>
                <p className="text-sm text-neutral-500 mt-1">Best for: Names, brief answers, specific details</p>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">Free Text</span>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-5">
              <p className="text-neutral-800 font-medium mb-4">Who is your key worker? (name/role)</p>
              
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter name or role..."
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-800
                         bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900
                         placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* 4. Textarea */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Format 4</span>
                <h2 className="text-lg font-semibold text-neutral-900">Long Text (Textarea)</h2>
                <p className="text-sm text-neutral-500 mt-1">Best for: Detailed responses, notes, quotes</p>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">Free Text</span>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-5">
              <p className="text-neutral-800 font-medium mb-4">Tell me about the last time you needed help quickly — what happened?</p>
              
              <textarea
                value={textarea}
                onChange={(e) => setTextarea(e.target.value)}
                placeholder="Record the resident's response..."
                rows={4}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-800
                         bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900
                         placeholder:text-neutral-400 resize-none"
              />
              <p className="text-xs text-neutral-400 mt-2">{textarea.length} characters</p>
            </div>
          </div>

          {/* 5. Radio Buttons */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Format 5</span>
                <h2 className="text-lg font-semibold text-neutral-900">Radio Buttons</h2>
                <p className="text-sm text-neutral-500 mt-1">Best for: Single choice from few options (visible)</p>
              </div>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Single Choice</span>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-5">
              <p className="text-neutral-800 font-medium mb-4">Do staff come when they say they will?</p>
              
              <div className="space-y-2">
                {['Always', 'Usually', 'Sometimes', 'Rarely', 'Never'].map(option => (
                  <label 
                    key={option}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      radio === option 
                        ? 'bg-neutral-900 border-neutral-900 text-white' 
                        : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="radio-demo"
                      value={option}
                      checked={radio === option}
                      onChange={(e) => setRadio(e.target.value)}
                      className="sr-only"
                    />
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      radio === option ? 'border-white' : 'border-neutral-300'
                    }`}>
                      {radio === option && <span className="w-2 h-2 bg-white rounded-full" />}
                    </span>
                    <span className="font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Checkboxes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Format 6</span>
                <h2 className="text-lg font-semibold text-neutral-900">Checkboxes (Multi-select)</h2>
                <p className="text-sm text-neutral-500 mt-1">Best for: Multiple selections allowed</p>
              </div>
              <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">Multi Choice</span>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-5">
              <p className="text-neutral-800 font-medium mb-4">What do staff help you with day to day? (select all that apply)</p>
              
              <div className="grid grid-cols-2 gap-2">
                {['Cooking/nutrition', 'Cleaning/laundry', 'Shopping', 'Appointments', 'Forms/benefits', 'Budgeting', 'Medication', 'Emotional support'].map(option => (
                  <label 
                    key={option}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      checkboxes.includes(option)
                        ? 'bg-neutral-900 border-neutral-900 text-white' 
                        : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkboxes.includes(option)}
                      onChange={() => toggleCheckbox(option)}
                      className="sr-only"
                    />
                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      checkboxes.includes(option) ? 'border-white bg-white' : 'border-neutral-300'
                    }`}>
                      {checkboxes.includes(option) && (
                        <svg className="w-3 h-3 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-neutral-400 mt-3">{checkboxes.length} selected</p>
            </div>
          </div>

          {/* 7. Yes/No Toggle */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Format 7</span>
                <h2 className="text-lg font-semibold text-neutral-900">Toggle Switch</h2>
                <p className="text-sm text-neutral-500 mt-1">Best for: Yes/No, True/False questions</p>
              </div>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Binary</span>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <p className="text-neutral-800 font-medium">Do you have a written support plan?</p>
                
                <button
                  onClick={() => setToggle(!toggle)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    toggle ? 'bg-green-500' : 'bg-neutral-300'
                  }`}
                >
                  <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    toggle ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <p className={`text-sm mt-2 font-medium ${toggle ? 'text-green-600' : 'text-neutral-500'}`}>
                {toggle ? 'Yes' : 'No'}
              </p>
            </div>
          </div>

          {/* 8. Yes/No/Unsure Buttons */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Format 8</span>
                <h2 className="text-lg font-semibold text-neutral-900">Yes / No / Unsure Buttons</h2>
                <p className="text-sm text-neutral-500 mt-1">Best for: Quick categorical responses with neutral option</p>
              </div>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Single Choice</span>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-5">
              <p className="text-neutral-800 font-medium mb-4">Do you feel safe where you live?</p>
              
              <div className="flex gap-3">
                {[
                  { value: 'yes', label: 'Yes', color: 'green' },
                  { value: 'no', label: 'No', color: 'red' },
                  { value: 'sometimes', label: 'Sometimes', color: 'amber' },
                  { value: 'unsure', label: 'Unsure', color: 'neutral' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setYesNoMaybe(option.value)}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                      yesNoMaybe === option.value
                        ? option.color === 'green' ? 'bg-green-500 text-white' :
                          option.color === 'red' ? 'bg-red-500 text-white' :
                          option.color === 'amber' ? 'bg-amber-500 text-white' :
                          'bg-neutral-500 text-white'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 9. Likert Scale */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Format 9</span>
                <h2 className="text-lg font-semibold text-neutral-900">Likert Scale</h2>
                <p className="text-sm text-neutral-500 mt-1">Best for: Agreement/disagreement statements</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Scale</span>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-5">
              <p className="text-neutral-800 font-medium mb-4">"Staff speak to me with respect."</p>
              
              <div className="flex gap-2">
                {[
                  { value: 'strongly-disagree', label: 'Strongly Disagree', short: 'SD' },
                  { value: 'disagree', label: 'Disagree', short: 'D' },
                  { value: 'neutral', label: 'Neutral', short: 'N' },
                  { value: 'agree', label: 'Agree', short: 'A' },
                  { value: 'strongly-agree', label: 'Strongly Agree', short: 'SA' }
                ].map((option, idx) => (
                  <button
                    key={option.value}
                    onClick={() => setLikert(option.value)}
                    className={`flex-1 py-4 rounded-lg font-medium transition-colors text-center ${
                      likert === option.value
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400'
                    }`}
                  >
                    <span className="block text-lg">{idx + 1}</span>
                    <span className="block text-xs mt-1 opacity-80">{option.short}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-neutral-400 mt-2 px-1">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
            </div>
          </div>

          {/* 10. Star Rating */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Format 10</span>
                <h2 className="text-lg font-semibold text-neutral-900">Star Rating</h2>
                <p className="text-sm text-neutral-500 mt-1">Best for: Quick visual ratings (1-5)</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Quantitative</span>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-5">
              <p className="text-neutral-800 font-medium mb-4">Rate the quality of communication from staff:</p>
              
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-4xl transition-transform hover:scale-110"
                  >
                    {star <= rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
              <p className="text-sm text-neutral-500 mt-2">
                {rating === 0 ? 'Not rated' : `${rating} out of 5`}
              </p>
            </div>
          </div>

          {/* 11. Number Input */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Format 11</span>
                <h2 className="text-lg font-semibold text-neutral-900">Number Input</h2>
                <p className="text-sm text-neutral-500 mt-1">Best for: Counts, frequencies, quantities</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Quantitative</span>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-5">
              <p className="text-neutral-800 font-medium mb-4">Over the last month, how many times has support not happened as planned?</p>
              
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="0"
                  value={numberInput}
                  onChange={(e) => setNumberInput(e.target.value)}
                  placeholder="0"
                  className="w-24 px-4 py-3 border border-neutral-200 rounded-lg text-center text-xl font-bold
                           bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                <span className="text-neutral-600">times</span>
              </div>
            </div>
          </div>

          {/* 12. Segmented Control */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Format 12</span>
                <h2 className="text-lg font-semibold text-neutral-900">Segmented Control</h2>
                <p className="text-sm text-neutral-500 mt-1">Best for: Quick selection from 3-5 options</p>
              </div>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Single Choice</span>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-5">
              <p className="text-neutral-800 font-medium mb-4">How often do visits get cancelled?</p>
              
              <div className="inline-flex bg-neutral-200 rounded-lg p-1">
                {['Never', 'Rarely', 'Sometimes', 'Often', 'Always'].map(option => (
                  <button
                    key={option}
                    onClick={() => setSegmented(option)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      segmented === option
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 13. Multi-dimension Sliders */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Format 13</span>
                <h2 className="text-lg font-semibold text-neutral-900">Multi-dimension Rating</h2>
                <p className="text-sm text-neutral-500 mt-1">Best for: Rating multiple aspects at once</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Multi-scale</span>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-5">
              <p className="text-neutral-800 font-medium mb-6">Rate the following aspects of support:</p>
              
              <div className="space-y-6">
                {[
                  { key: 'reliability', label: 'Reliability' },
                  { key: 'respect', label: 'Respect & Dignity' },
                  { key: 'safety', label: 'Safety' }
                ].map(item => (
                  <div key={item.key} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-700 font-medium">{item.label}</span>
                      <span className={`font-bold ${
                        multiSlider[item.key as keyof typeof multiSlider] >= 7 ? 'text-green-600' :
                        multiSlider[item.key as keyof typeof multiSlider] >= 4 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {multiSlider[item.key as keyof typeof multiSlider]}/10
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={multiSlider[item.key as keyof typeof multiSlider]}
                      onChange={(e) => setMultiSlider(prev => ({
                        ...prev,
                        [item.key]: parseInt(e.target.value)
                      }))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                               [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-neutral-900 
                               [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 14. Quote Capture */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Format 14</span>
                <h2 className="text-lg font-semibold text-neutral-900">Quote Capture</h2>
                <p className="text-sm text-neutral-500 mt-1">Best for: Recording direct resident quotes with sentiment</p>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">Evidence</span>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-5 space-y-4">
              <p className="text-neutral-800 font-medium">Capture a direct quote from the resident:</p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Resident ID (e.g., A, B, C)"
                  className="w-28 px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white"
                />
                <select className="px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white flex-1">
                  <option>Sentiment...</option>
                  <option value="positive">✓ Positive</option>
                  <option value="concern">⚠ Concern</option>
                  <option value="neutral">○ Neutral</option>
                </select>
              </div>
              
              <textarea
                placeholder="Type the exact quote..."
                rows={3}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-sm bg-white
                         placeholder:text-neutral-400 resize-none italic"
              />
              
              <button className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg">
                + Add Quote
              </button>
            </div>
          </div>

        </div>

        {/* Summary */}
        <div className="mt-12 bg-neutral-900 text-white rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-4">Format Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-neutral-400 mb-1">Quantitative</p>
              <ul className="space-y-1">
                <li>• Slider (1-10)</li>
                <li>• Star Rating</li>
                <li>• Number Input</li>
                <li>• Multi-dimension</li>
              </ul>
            </div>
            <div>
              <p className="text-neutral-400 mb-1">Single Choice</p>
              <ul className="space-y-1">
                <li>• Dropdown</li>
                <li>• Radio Buttons</li>
                <li>• Toggle (Yes/No)</li>
                <li>• Segmented Control</li>
                <li>• Likert Scale</li>
              </ul>
            </div>
            <div>
              <p className="text-neutral-400 mb-1">Free Form</p>
              <ul className="space-y-1">
                <li>• Short Text</li>
                <li>• Long Text</li>
                <li>• Quote Capture</li>
                <li>• Multi-select</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-center text-neutral-500 text-sm mt-8">
          Each question in the inspection can use any of these formats. 
          <br />The format is configured per-question in the section data.
        </p>
      </div>
    </div>
  );
}
