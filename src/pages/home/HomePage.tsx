import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const featureList = [
    {
      title: 'PERSPECTIVE WARP',
      subtitle: '퍼스펙티브 워프',
      description: '직관적인 포인트 컨트롤로 이미지를 자유롭게 변형',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      title: 'REAL-TIME PREVIEW',
      subtitle: '리얼타임 프리뷰',
      description: '변형 과정을 실시간으로 확인하며 작업',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      title: 'BATCH EXPORT',
      subtitle: '배치 익스포트',
      description: '여러 이미지를 한 번에 처리하고 다운로드',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'UPLOAD',
      description: '드래그 & 드롭 또는 클릭으로 파일 업로드',
    },
    {
      step: '02',
      title: 'TRANSFORM',
      description: '포인트 컨트롤로 퍼스펙티브 변형',
    },
    {
      step: '03',
      title: 'EXPORT',
      description: 'ZIP 포맷으로 배치 다운로드',
    },
  ];

  return (
    <React.Fragment>
      <div className={cn(
        'min-h-screen relative',
        'bg-white',
        'overflow-hidden'
      )}>
        {/* BACKGROUND EFFECTS */}
        <div className={cn(
          'fixed inset-0 z-0',
          'bg-gradient-to-br from-gray-50 to-white'
        )} />

        {/* HERO SECTION */}
        <section className={cn(
          'relative z-10',
          'min-h-screen flex items-center justify-center',
          'px-4 py-20'
        )}>
          <div className={cn('max-w-7xl w-full mx-auto')}>
            <div className={cn('text-center space-y-8')}>
              {/* BADGE */}
              <div className={cn(
                'inline-flex items-center gap-2',
                'px-4 py-2 rounded-full',
                'bg-gray-100',
                'border border-gray-200'
              )}>
                <span className={cn(
                  'w-2 h-2 rounded-full bg-black'
                )} />
                <span className={cn(
                  'text-xs font-mono uppercase tracking-[0.3em]',
                  'text-gray-600'
                )}>
                  IMAGE TRANSFORM STUDIO
                </span>
              </div>

              {/* TITLE */}
              <h1 className={cn(
                'text-5xl sm:text-6xl lg:text-[80px]',
                'font-black tracking-tight',
                'text-gray-900'
              )}>
                IMAGE
                <span className={cn('block mt-2')}>TRANSFORM</span>
              </h1>

              {/* SUBTITLE */}
              <p className={cn(
                'max-w-2xl mx-auto',
                'text-lg sm:text-xl',
                'text-gray-600',
                'font-light tracking-wide'
              )}>
                포토샵없이 브라우저에서 바로 이미지를 변환하세요.
                <span className={cn('block mt-2 text-gray-900')}>
                  퍼스펙티브 변형, 리얼타임 프리뷰, 배치 다운로드
                </span>
              </p>

              {/* CTA BUTTONS */}
              <div className={cn('flex flex-col sm:flex-row gap-4 justify-center pt-8')}>
                <button
                  onClick={() => navigate('/image-transform')}
                  className={cn(
                    'px-8 py-4 rounded-lg',
                    'bg-black text-white',
                    'font-semibold text-lg',
                    'hover:bg-gray-800',
                    'transition-colors duration-200',
                    'flex items-center justify-center gap-2'
                  )}
                >
                  스튜디오 시작하기
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>

                <button
                  onClick={() => navigate('/image-transform')}
                  className={cn(
                    'px-8 py-4 rounded-lg',
                    'bg-white text-gray-900',
                    'border-2 border-gray-200',
                    'font-semibold text-lg',
                    'hover:border-gray-300 hover:bg-gray-50',
                    'transition-all duration-200'
                  )}
                >
                  기능 살펴보기
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className={cn(
          'relative z-10',
          'py-32 px-4'
        )}>
          <div className={cn('max-w-7xl mx-auto')}>
            <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-8')}>
              {featureList.map((feature) => (
                <div
                  key={feature.title}
                  onClick={() => navigate('/image-transform')}
                  className={cn(
                    'relative overflow-hidden p-8',
                    'bg-white',
                    'border border-gray-200 rounded-2xl',
                    'group cursor-pointer',
                    'hover:border-gray-300 hover:shadow-lg',
                    'transition-all duration-200'
                  )}
                >
                  <div className={cn('relative z-10 space-y-6')}>
                    {/* Icon */}
                    <div className={cn(
                      'inline-flex items-center justify-center',
                      'w-16 h-16 rounded-xl',
                      'bg-gray-100',
                      'text-gray-700',
                      'group-hover:bg-gray-900 group-hover:text-white',
                      'transition-all duration-200'
                    )}>
                      {feature.icon}
                    </div>

                    {/* Content */}
                    <div className={cn('space-y-3')}>
                      <h3 className={cn(
                        'text-xl font-bold',
                        'text-gray-900',
                        'tracking-tight'
                      )}>
                        {feature.title}
                      </h3>
                      <p className={cn(
                        'text-sm font-mono uppercase',
                        'text-gray-500',
                        'tracking-wider'
                      )}>
                        {feature.subtitle}
                      </p>
                      <p className={cn(
                        'text-gray-600',
                        'leading-relaxed'
                      )}>
                        {feature.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className={cn(
                      'absolute bottom-8 right-8',
                      'text-gray-400',
                      'opacity-0 group-hover:opacity-100',
                      'transform translate-x-2 group-hover:translate-x-0',
                      'transition-all duration-200'
                    )}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={cn('rounded-3xl border border-slate-200 bg-slate-50 px-6 py-12 sm:px-10 sm:py-14')}> 
          <div className={cn('mx-auto flex max-w-4xl flex-col gap-10')}> 
            <div className={cn('space-y-3 text-center md:text-left')}>
              <span className={cn('text-xs font-semibold uppercase tracking-[0.2em] text-blue-600')}>Workflow</span>
              <h2 className={cn('text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900')}>
                세 단계로 끝나는 이미지 변형 경험
              </h2>
              <p className={cn('max-w-2xl text-sm sm:text-base leading-relaxed text-slate-500')}>
                필요한 컨트롤만 남기고, 불필요한 장식을 덜어낸 인터페이스로 작업 흐름을 매끄럽게 이어갑니다.
              </p>
            </div>

            <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6')}>
              {workflowSteps.map((step, index) => (
                <div
                  key={step.title}
                  className={cn(
                    'group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7',
                    'transition-transform duration-200 hover:-translate-y-1 hover:border-slate-900 hover:shadow-lg'
                  )}
                >
                  <div className={cn('flex items-center justify-between text-xs text-slate-400')}>
                    <span>STEP {index + 1}</span>
                    <span className={cn('inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-medium transition-transform duration-200 group-hover:scale-110')}>
                      {index + 1}
                    </span>
                  </div>
                  <div className={cn('space-y-2')}>
                    <h3 className={cn('text-base font-semibold text-slate-900')}>{step.title}</h3>
                    <p className={cn('text-sm leading-relaxed text-slate-500')}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={cn('rounded-3xl border border-slate-200 bg-slate-900 px-6 py-12 sm:px-10 sm:py-16 text-white')}> 
          <div className={cn('mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:gap-8')}> 
            <div className={cn('inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200')}>Ready When You Are</div>
            <h2 className={cn('text-3xl sm:text-4xl font-semibold tracking-tight text-white')}>
              지금 바로 스튜디오를 열고
              <span className={cn('block text-slate-300')}>이미지를 정리해보세요.</span>
            </h2>
            <p className={cn('max-w-xl text-sm sm:text-base leading-relaxed text-slate-300')}>
              설치 없이 브라우저에서 즉시 실행됩니다. 변형 기록과 내보내기 폴더까지 한 번에 준비할 수 있어요.
            </p>
            <div className={cn('flex w-full flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4')}>
              <button
                onClick={() => navigate('/image-transform')}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-slate-100'
                )}
              >
                스튜디오 실행하기
              </button>
              <button
                onClick={() => navigate('/image-transform')}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white'
                )}
              >
                데모 살펴보기
              </button>
            </div>
          </div>
        </section>
      </div>
    </React.Fragment>
  );
};
