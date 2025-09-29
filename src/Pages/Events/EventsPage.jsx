import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useDarkModeStore from "../../Store/useDarkModeStore";
import { useAuth } from "../../Contexts/AuthContext";
import RockPaperScissors from "../../Components/Games/RockPaperScissors/RockPaperScissors";

const EventsPage = () => {
  const { dark } = useDarkModeStore();
  const { currentUser, userProfile, loading, signInAnonymously } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // 로그인하지 않았으면 모달 표시
  useEffect(() => {
    if (!loading && !currentUser) {
      setShowAuthModal(true);
    }
  }, [currentUser, loading]);

  // 로딩 중이면 로딩 표시
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className={`text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>読み込み中...</p>
        </div>
      </div>
    );
  }

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously();
      setIsGuestMode(true);
      setShowAuthModal(false);
    } catch (error) {
      console.error('게스트 로그인 오류:', error);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: { pathname: '/events' } } });
  };

  const handleSignupRedirect = () => {
    navigate('/signup', { state: { from: { pathname: '/events' } } });
  };

  // 로그인하지 않았으면 모달 표시
  if (!currentUser) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1
            className={`text-4xl font-bold text-center transition-colors duration-300 -mt-4 ${
              dark ? "text-white" : "text-gray-900"
            }`}
          >
            イベント&ゲーム
          </h1>
        </div>

        {/* 인증 선택 모달 */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-500"
              onClick={() => setShowAuthModal(false)}
            ></div>
            <div className={`relative w-full max-w-md mx-4 p-6 rounded-lg shadow-xl transition-all duration-500 transform ${
              dark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="text-center">
                <h2 className={`text-2xl font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
                  ゲームをプレイするには
                </h2>
                <p className={`text-sm mb-6 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  ログインまたはゲストとしてプレイしてください
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={handleLoginRedirect}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-500 hover:scale-105 ${
                      dark 
                        ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                        : 'bg-cyan-500 text-white hover:bg-cyan-600'
                    }`}
                  >
                    ログイン
                  </button>
                  
                  <button
                    onClick={handleSignupRedirect}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-500 hover:scale-105 ${
                      dark 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    会員登録
                  </button>
                  
                  <button
                    onClick={handleGuestLogin}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-500 hover:scale-105 ${
                      dark 
                        ? 'bg-gray-600 text-white hover:bg-gray-700' 
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  >
                    ゲストとしてプレイ
                  </button>
                </div>
                
                <div className={`mt-4 p-3 rounded-lg text-xs ${dark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}`}>
                  <p className="font-medium">⚠️ ゲストでプレイする場合</p>
                  <p className="mt-1">記録が残らず、ランキングに参加できません。</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <motion.div 
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 ${dark ? 'border-t border-gray-700' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className={`text-4xl font-bold text-center transition-colors duration-300 -mt-4 ${
          dark ? "text-white" : "text-gray-900"
        }`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        イベント&ゲーム
      </motion.h1>

      {/* 사용자 상태 표시 영역 */}
      <motion.div 
        className={`mt-6 mb-8 p-4 rounded-lg transition-all duration-500 ${
          userProfile?.isAnonymous 
            ? (dark 
                ? 'bg-gray-700 border border-gray-600' 
                : 'bg-gray-100 border border-gray-300')
            : (dark 
                ? 'bg-cyan-900/30 border border-cyan-700' 
                : 'bg-cyan-50 border border-cyan-200')
        }`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              className={`w-3 h-3 rounded-full ${
                userProfile?.isAnonymous ? 'bg-gray-500' : 'bg-cyan-500'
              }`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.div>
            <div>
              <p className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                {userProfile?.nickname || 'ユーザー'}
              </p>
              <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                {userProfile?.isAnonymous ? 'ゲストユーザー' : '会員ユーザー'}
              </p>
            </div>
          </div>
          <AnimatePresence>
            {userProfile?.isAnonymous && (
              <motion.div 
                className={`text-xs px-2 py-1 rounded-full ${
                  dark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                ランキング不可
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <RockPaperScissors />
      </motion.div>
    </motion.div>
  );
};

export default EventsPage;
