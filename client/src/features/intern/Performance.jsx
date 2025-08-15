import React from "react";
import { motion } from "framer-motion";
import { Circle } from "rc-progress";
import {
  Star as StarIcon,
  Users,
  TrendingUp,
  FileDown,
  Code,
  Clock,
  ThumbsUp,
  Zap,
  MessageSquare,
  Award,
} from "lucide-react";

// Sample evaluation data (mimicking evaluatedInterns from PerformanceOverview)
const evaluation = {
  id: 1,
  name: "Juan Dela Cruz",
  skills: {
    "Technical Skills": 80, // 4 stars
    "Problem Solving": 60, // 3 stars
    "Communication": 100, // 5 stars
    "Teamwork": 80, // 4 stars
    "Adaptability": 80, // 4 stars
    "Time Management": 60, // 3 stars
    "Professionalism": 80, // 4 stars
  },
  feedback: "The intern demonstrated strong technical aptitude, team collaboration, and growth mindset throughout the internship. Highly recommended for future roles.",
  supervisor: "Engr. Supervisor Name",
  readiness: 78, // Average of skill percentages
  badges: ["React Expert", "Team Player", "Fast Learner"],
  date: "2025-05-13",
};

const PerformanceFinalEvaluation = () => {
  const skills = Object.entries(evaluation.skills).map(([name, score]) => ({
    name,
    score,
  }));

  const readinessScore = evaluation.readiness;

  const getSkillIcon = (skill) => {
    switch (skill) {
      case "Technical Skills": return <Code className="w-4 h-4 text-blue-600" />;
      case "Problem Solving": return <Zap className="w-4 h-4 text-yellow-600" />;
      case "Communication": return <MessageSquare className="w-4 h-4 text-green-600" />;
      case "Teamwork": return <Users className="w-4 h-4 text-purple-600" />;
      case "Time Management": return <Clock className="w-4 h-4 text-red-600" />;
      case "Professionalism": return <Award className="w-4 h-4 text-indigo-600" />;
      default: return <TrendingUp className="w-4 h-4 text-gray-600" />;
    }
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case "React Expert": return <StarIcon className="w-4 h-4 text-blue-600" />;
      case "Team Player": return <Users className="w-4 h-4 text-blue-600" />;
      case "Fast Learner": return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case "Punctual": return <Clock className="w-4 h-4 text-blue-600" />;
      case "Clean Coder": return <Code className="w-4 h-4 text-blue-600" />;
      case "Top Performer": return <ThumbsUp className="w-4 h-4 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="text-blue-500" />
            <span>Final Evaluation Summary - {evaluation.name}</span>
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Performance Evaluation
          </h2>

          {/* Skills Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Skills Assessment</h3>
            <p className="text-sm text-gray-500">
              Scores are based on supervisor ratings on your performance.
            </p>
            {skills.map((skill, idx) => (
              <div key={idx} className="py-3 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-medium text-gray-700">
                    {getSkillIcon(skill.name)}
                    {skill.name}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600">{skill.score}/100</span>
                    <Circle
                      percent={skill.score}
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

          {/* Readiness Score */}
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

          {/* Supervisor Feedback */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Supervisor Feedback</h3>
            <p className="text-sm text-gray-700 italic">"{evaluation.feedback}"</p>
            <p className="text-xs text-right text-gray-400">– {evaluation.supervisor}</p>
          </div>

          {/* Badges */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Earned Badges</h3>
            <div className="flex gap-2 flex-wrap">
              {evaluation.badges.length > 0 ? (
                evaluation.badges.map((badge, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-200"
                  >
                    {getBadgeIcon(badge)}
                    {badge}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">No badges earned</p>
              )}
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
            >
              <FileDown className="w-4 h-4" />
              Export PDF Report
            </button>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default PerformanceFinalEvaluation;
