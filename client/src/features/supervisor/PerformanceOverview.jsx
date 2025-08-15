import { useState } from "react";
import { Circle } from "rc-progress";
import { toast } from "react-hot-toast";
import {
  Star as StarIcon,
  Users,
  TrendingUp,
  SendHorizonal,
  Layout,
  Clock,
  Code,
  MessageSquare,
  ThumbsUp,
  Zap,
  Award
} from "lucide-react";

const interns = [
  { id: 1, name: "Juan Dela Cruz" },
  { id: 2, name: "Maria Santos" },
  { id: 3, name: "Jose Ramirez" },
  { id: 4, name: "Angela Reyes" },
  { id: 5, name: "Liam Garcia" },
];

const initialSkills = {
  "Technical Skills": 0,
  "Problem Solving": 0,
  "Communication": 0,
  "Teamwork": 0,
  "Adaptability": 0,
  "Time Management": 0,
  "Professionalism": 0,
};

const PerformanceOverview = () => {
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [form, setForm] = useState({
    skills: initialSkills,
    feedback: "",
    supervisor: "Engr. Supervisor Name",
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [evaluatedInterns, setEvaluatedInterns] = useState([]);

  const handleRatingChange = (skill, value) => {
    const parsedValue = parseInt(value, 10);
    const percentage = isNaN(parsedValue) ? 0 : Math.max(0, Math.min(100, parsedValue));
    setForm(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skill]: percentage
      }
    }));
    // Clear error when a valid rating is entered
    if (errors[skill] && percentage >= 0 && percentage <= 100) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[skill];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate skills
    Object.entries(form.skills).forEach(([skill, value]) => {
      if (value === 0) {
        newErrors[skill] = "Please enter a rating (1–100)";
      } else if (value < 0 || value > 100) {
        newErrors[skill] = "Rating must be between 0 and 100";
      }
    });

    // Validate feedback
    if (form.feedback.trim().length < 10) {
      newErrors.feedback = "Feedback must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const readinessScore = Math.round(
    Object.values(form.skills).reduce((sum, v) => sum + v, 0) /
      Object.keys(form.skills).length
  );

  const getBadges = () => {
    const badges = [];
    if (form.skills["Technical Skills"] >= 80) badges.push("React Expert");
    if (form.skills["Teamwork"] >= 80) badges.push("Team Player");
    if (form.skills["Time Management"] >= 80) badges.push("Punctual");
    if (form.skills["Professionalism"] >= 80) badges.push("Clean Coder");
    if (readinessScore >= 80) badges.push("Fast Learner");
    if (readinessScore >= 90) badges.push("Top Performer");
    return badges;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Please complete all required fields correctly", {
        style: {
          background: '#f0f0f0',
          color: '#d33',
          border: '1px solid #ffb4b4',
        },
      });
      return;
    }

    const evaluation = {
      id: selectedIntern.id,
      name: selectedIntern.name,
      skills: form.skills,
      feedback: form.feedback,
      supervisor: form.supervisor,
      readiness: readinessScore,
      badges: getBadges(),
      date: form.date
    };

    setEvaluatedInterns((prev) => [...prev, evaluation]);
    setSelectedIntern(null);
    setForm({ 
      skills: initialSkills, 
      feedback: "", 
      supervisor: form.supervisor,
      date: new Date().toISOString().split('T')[0]
    });
    
    toast.success(`Evaluation submitted for ${selectedIntern.name}`, {
      icon: '📝',
      style: {
        background: '#f0f0f0',
        color: '#333',
        border: '1px solid #ddd',
      },
    });
  };

  const getSkillIcon = (skill) => {
    switch(skill) {
      case "Technical Skills": return <Code className="w-4 h-4 text-blue-600" />;
      case "Problem Solving": return <Zap className="w-4 h-4 text-yellow-600" />;
      case "Communication": return <MessageSquare className="w-4 h-4 text-green-600" />;
      case "Teamwork": return <Users className="w-4 h-4 text-purple-600" />;
      case "Time Management": return <Clock className="w-4 h-4 text-red-600" />;
      case "Professionalism": return <Award className="w-4 h-4 text-indigo-600" />;
      default: return <TrendingUp className="w-4 h-4 text-gray-600" />;
    }
  };

  const RatingInput = ({ skill }) => {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          max="100"
          value={form.skills[skill] === 0 ? '' : form.skills[skill]}
          onChange={(e) => handleRatingChange(skill, e.target.value)}
          className={`w-20 bg-gray-50 border ${errors[skill] ? 'border-red-300' : 'border-gray-300'} rounded-md px-2 py-1 text-sm text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-500`}
          placeholder="0–100"
          aria-label={`Rate ${skill} out of 100`}
        />
        <span className="text-sm font-medium text-gray-600">/100</span>
        {errors[skill] && (
          <span className="text-red-500 text-xs ml-2">{errors[skill]}</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Layout className="text-blue-500" />
            <span>Performance Overview</span>
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!selectedIntern ? (
          <>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Select Intern to Evaluate</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {interns.map((intern) => {
                const alreadyEvaluated = evaluatedInterns.some((e) => e.id === intern.id);
                return (
                  <div
                    key={intern.id}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                      alreadyEvaluated 
                        ? "bg-gray-100 border-gray-200 cursor-not-allowed" 
                        : "bg-white border-gray-300 hover:shadow-md hover:border-blue-300"
                    }`}
                    onClick={() => !alreadyEvaluated && setSelectedIntern(intern)}
                  >
                    <h4 className="text-lg font-semibold text-gray-800">{intern.name}</h4>
                    <p className="text-sm text-gray-600">
                      {alreadyEvaluated ? "✓ Already Evaluated" : "Click to evaluate"}
                    </p>
                  </div>
                );
              })}
            </div>

            {evaluatedInterns.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Evaluation History</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {evaluatedInterns.map((e) => (
                    <div key={e.id} className="bg-white rounded-lg border border-gray-200 p-5 space-y-3 shadow-sm">
                      <div className="flex justify-between">
                        <h4 className="text-lg font-semibold text-gray-800">{e.name}</h4>
                        <span className="text-xs text-gray-500">{e.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Career Readiness:{" "}
                        <span className="font-medium text-green-600">{e.readiness}/100</span>
                      </p>
                      <div className="text-sm text-gray-700 italic">"{e.feedback}"</div>
                      <div className="flex flex-wrap gap-2">
                        {e.badges.map((badge, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs border border-blue-200"
                          >
                            {badge === "React Expert" && <StarIcon className="w-4 h-4 text-blue-600" />}
                            {badge === "Team Player" && <Users className="w-4 h-4 text-blue-600" />}
                            {badge === "Fast Learner" && <TrendingUp className="w-4 h-4 text-blue-600" />}
                            {badge === "Punctual" && <Clock className="w-4 h-4 text-blue-600" />}
                            {badge === "Clean Coder" && <Code className="w-4 h-4 text-blue-600" />}
                            {badge === "Top Performer" && <ThumbsUp className="w-4 h-4 text-blue-600" />}
                            {badge}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-right text-gray-400">– {e.supervisor}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-4 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 border-b pb-2">
              Evaluating: {selectedIntern.name}
            </h3>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">Skills Assessment</h4>
              {Object.keys(form.skills).map((skill) => (
                <div key={skill} className="py-3 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-medium text-gray-700">
                      {getSkillIcon(skill)}
                      {skill}
                    </span>
                    <div className="flex items-center gap-4">
                      <RatingInput skill={skill} />
                      <Circle
                        percent={form.skills[skill]}
                        strokeWidth={6}
                        strokeColor="#4F46E5"
                        trailColor="#E5E7EB"
                        className="w-8 h-8"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-6 border border-blue-100">
              <Circle
                percent={readinessScore}
                strokeWidth={8}
                strokeColor="#10B981"
                trailColor="#E5E7EB"
                className="w-16 h-16"
              />
              <div>
                <p className="text-2xl font-bold text-green-600">{readinessScore}/100</p>
                <p className="text-sm text-gray-600">Career Readiness Score</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-800">Supervisor Feedback</h4>
              <textarea
                rows={4}
                value={form.feedback}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, feedback: e.target.value }));
                  if (errors.feedback) {
                    setErrors(prev => ({ ...prev, feedback: null }));
                  }
                }}
                className={`w-full bg-gray-50 border ${errors.feedback ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-500`}
                placeholder="Write final remarks here..."
              />
              {errors.feedback && (
                <p className="text-red-500 text-sm">{errors.feedback}</p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-800">Auto-Assigned Badges</h4>
              <div className="flex gap-2 flex-wrap">
                {getBadges().length > 0 ? (
                  getBadges().map((badge, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm border border-indigo-200"
                    >
                      {badge === "React Expert" && <StarIcon className="w-4 h-4 text-indigo-600" />}
                      {badge === "Team Player" && <Users className="w-4 h-4 text-indigo-600" />}
                      {badge === "Fast Learner" && <TrendingUp className="w-4 h-4 text-indigo-600" />}
                      {badge === "Punctual" && <Clock className="w-4 h-4 text-indigo-600" />}
                      {badge === "Clean Coder" && <Code className="w-4 h-4 text-indigo-600" />}
                      {badge === "Top Performer" && <ThumbsUp className="w-4 h-4 text-indigo-600" />}
                      {badge}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No badges earned yet</p>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedIntern(null)}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-1 hover:bg-gray-100 px-3 py-2 rounded"
              >
                ← Back to intern list
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
              >
                <SendHorizonal className="w-4 h-4" />
                Submit Evaluation
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PerformanceOverview;