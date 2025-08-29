import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Switch,
  FormControlLabel,
  LinearProgress,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  AutoFixHigh as AIIcon,
  Psychology as BrainIcon,
  Edit as EditIcon,
  LocalOffer as TagIcon,
  Assignment as ClipboardIcon,
  Save as SaveIcon,
  Description as DocumentIcon,
  MenuBook as BookIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

interface SearchResult {
  title: string;
  description: string;
  url: string;
  content: string;
  id: string;
}

interface GeneratedContent {
  title: string;
  content: string;
  keywords: string[];
  summary: string;
}

const ContentGenerator: React.FC = () => {
  // State
  const [keyword, setKeyword] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAlert, setShowAlert] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  
  // Settings
  const [searchCount, setSearchCount] = useState<number>(5);
  const [contentLength, setContentLength] = useState<number>(1000);
  const [useAdvancedMode, setUseAdvancedMode] = useState<boolean>(false);
  const [includeKeywords, setIncludeKeywords] = useState<boolean>(true);

  // 모의 블로그 검색 (실제 구현에서는 서버 API 호출)
  const searchBlogs = async () => {
    if (!keyword.trim()) {
      showAlertMessage('검색 키워드를 입력해주세요.', 'warning');
      return;
    }

    setIsSearching(true);
    setSearchResults([]);

    try {
      // 실제로는 서버 API를 호출해야 함
      // 여기서는 모의 데이터 생성
      const mockResults: SearchResult[] = Array.from({ length: searchCount }, (_, index) => ({
        id: `result-${index}`,
        title: `${keyword} 관련 블로그 포스트 ${index + 1}`,
        description: `${keyword}에 대한 상세한 정보와 경험을 공유하는 블로그 포스트입니다. 실용적인 팁과 노하우를 담고 있습니다.`,
        url: `https://example-blog${index + 1}.com/post`,
        content: `${keyword}에 대한 자세한 내용입니다. 이 주제는 매우 중요하고 실생활에 많은 도움이 됩니다. 
        
여러 전문가들의 의견을 종합해보면, ${keyword}는 다음과 같은 특징을 가지고 있습니다:

1. 실용성이 높음
2. 접근하기 쉬움  
3. 효과가 빠름
4. 비용 대비 효율적

더 자세한 정보는 실제 경험을 통해 얻을 수 있으며, 지속적인 관심과 연구가 필요한 분야입니다. ${keyword}에 관심이 있다면 꾸준한 학습과 실습을 통해 더 나은 결과를 얻을 수 있을 것입니다.

최근 트렌드를 살펴보면 ${keyword} 분야는 계속 발전하고 있으며, 앞으로도 주목할 만한 변화들이 예상됩니다.`
      }));

      // 검색 시뮬레이션 지연
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSearchResults(mockResults);
      showAlertMessage(`${mockResults.length}개의 검색 결과를 찾았습니다.`, 'success');
      
    } catch (error) {
      showAlertMessage('검색 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  // 콘텐츠 생성 (실제로는 AI API 호출)
  const generateContent = async () => {
    if (searchResults.length === 0) {
      showAlertMessage('먼저 검색을 실행해주세요.', 'warning');
      return;
    }

    setIsGenerating(true);

    try {
      // 실제로는 AI 서비스 API 호출
      await new Promise(resolve => setTimeout(resolve, 3000));

      const generated: GeneratedContent = {
        title: `${keyword}에 대한 완전한 가이드`,
        content: `# ${keyword} 완벽 가이드

## 개요
${keyword}는 현재 많은 사람들이 관심을 갖고 있는 중요한 주제입니다. 이 가이드에서는 ${keyword}에 대한 포괄적인 정보를 제공하고자 합니다.

## 주요 특징
${keyword}의 가장 중요한 특징들을 살펴보면:

### 1. 실용성
${keyword}는 일상생활에서 직접적으로 활용할 수 있는 실용적인 가치를 제공합니다. 많은 사람들이 이를 통해 실질적인 도움을 받고 있으며, 그 효과는 즉시 나타나는 경우가 많습니다.

### 2. 접근성  
${keyword}는 누구나 쉽게 시작할 수 있습니다. 특별한 장비나 고도의 전문 지식이 없어도 기본적인 이해만으로도 충분히 활용할 수 있는 분야입니다.

### 3. 확장성
기초를 다진 후에는 더 깊이 있는 단계로 발전시킬 수 있습니다. ${keyword} 분야는 깊이와 넓이 모두를 제공하는 풍부한 영역입니다.

## 시작하는 방법

### 초보자를 위한 단계별 접근법
1. **기초 개념 이해**: ${keyword}의 핵심 개념부터 차근차근 학습
2. **실습 경험 쌓기**: 이론보다는 직접 해보는 것이 중요
3. **지속적인 개선**: 꾸준한 피드백과 개선을 통한 성장
4. **커뮤니티 참여**: 다른 사람들과의 경험 공유

### 주의사항
${keyword}를 시작할 때 주의해야 할 몇 가지 사항들:
- 너무 성급하게 서두르지 말 것
- 기초를 탄탄히 다질 것  
- 개인의 상황에 맞게 조정할 것
- 전문가의 조언을 구할 것

## 최신 트렌드
${keyword} 분야의 최근 동향을 살펴보면:

- **기술 발전**: 새로운 기술들이 지속적으로 도입되고 있음
- **사용자 증가**: 더 많은 사람들이 관심을 갖고 참여하고 있음  
- **다양화**: 여러 분야로의 응용과 확장이 활발함
- **전문화**: 보다 세분화되고 전문적인 접근법들이 등장

## 결론
${keyword}는 현재와 미래 모두에 걸쳐 중요한 가치를 제공하는 분야입니다. 올바른 접근과 꾸준한 노력을 통해 누구나 이 분야에서 성공적인 결과를 얻을 수 있을 것입니다.

지속적인 학습과 실천을 통해 ${keyword}의 전문가가 되어보시기 바랍니다.`,
        keywords: [keyword, `${keyword} 가이드`, `${keyword} 방법`, `${keyword} 팁`, `${keyword} 트렌드`],
        summary: `${keyword}에 대한 종합적인 가이드로, 기초부터 고급 단계까지 체계적으로 다룹니다. 실용적인 접근법과 최신 트렌드를 포함한 완성도 높은 콘텐츠입니다.`
      };

      setGeneratedContent(generated);
      showAlertMessage('콘텐츠가 성공적으로 생성되었습니다!', 'success');

    } catch (error) {
      showAlertMessage('콘텐츠 생성 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const showAlertMessage = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setShowAlert(message);
    setAlertSeverity(severity);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showAlertMessage('클립보드에 복사되었습니다.', 'success');
    }).catch(() => {
      showAlertMessage('복사 실패', 'error');
    });
  };

  const downloadContent = () => {
    if (!generatedContent) return;

    const content = `제목: ${generatedContent.title}\n\n${generatedContent.content}\n\n키워드: ${generatedContent.keywords.join(', ')}\n\n요약: ${generatedContent.summary}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${keyword}_generated_content.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showAlertMessage('파일이 다운로드되었습니다.', 'success');
  };

  const clearAll = () => {
    setKeyword('');
    setSearchResults([]);
    setGeneratedContent(null);
    setShowAlert('');
    showAlertMessage('모든 데이터가 초기화되었습니다.', 'info');
  };

  return (
    <Box className="w-full min-h-[calc(100vh-120px)]">
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold mb-2 flex items-center gap-3 text-gray-800">
          <BrainIcon className="text-purple-600" sx={{ fontSize: 36 }} />
          AI 원고 변환 & 콘텐츠 생성기
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          키워드 검색부터 AI 콘텐츠 생성까지 한 번에 해결하세요
        </Typography>
      </Box>

      {showAlert && (
        <Alert 
          severity={alertSeverity} 
          onClose={() => setShowAlert('')}
          className="mb-4 animate-in slide-in-from-top-2 duration-300"
          sx={{
            borderRadius: 2,
            boxShadow: 2,
            '& .MuiAlert-message': {
              fontWeight: 500
            }
          }}
        >
          {showAlert}
        </Alert>
      )}

      <Box className="flex gap-6 h-[calc(100vh-200px)]">
        <Box className="w-full lg:w-1/4">
          <Card className="shadow-lg border-0 h-fit">
            <CardContent>
              <Typography variant="h6" className="font-bold mb-4 text-gray-800 flex items-center gap-2">
                <SearchIcon className="text-blue-600" />
                키워드 검색
              </Typography>

              <TextField
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="예: 건강한 식습관"
                fullWidth
                variant="outlined"
                className="mb-4"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    searchBlogs();
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    }
                  }
                }}
              />

              <Box className="flex gap-2 mb-6">
                <Button
                  onClick={searchBlogs}
                  disabled={isSearching || !keyword.trim()}
                  variant="contained"
                  startIcon={<SearchIcon />}
                  className="flex-1 py-3 rounded-xl font-semibold"
                  sx={{
                    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                    },
                    '&:disabled': {
                      background: '#9ca3af'
                    }
                  }}
                >
                  {isSearching ? '검색 중...' : '블로그 검색'}
                </Button>
                <Tooltip title="모든 데이터 초기화">
                  <Button
                    onClick={clearAll}
                    disabled={isSearching || isGenerating}
                    variant="outlined"
                    className="px-4 py-3 rounded-xl"
                    sx={{
                      borderColor: '#6b7280',
                      color: '#374151',
                      '&:hover': {
                        borderColor: '#ef4444',
                        color: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.05)',
                      }
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Tooltip>
              </Box>

              {isSearching && (
                <Box className="mb-4">
                  <LinearProgress 
                    className="rounded-full h-2" 
                    sx={{
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                        borderRadius: '4px'
                      }
                    }}
                  />
                  <Typography variant="body2" className="text-center text-gray-600 mt-2">
                    검색 중...
                  </Typography>
                </Box>
              )}

              <Divider className="my-6" sx={{ borderColor: '#e5e7eb' }} />

              <Typography variant="h6" className="font-bold mb-4 text-gray-800">
                생성 설정
              </Typography>

              <FormControl fullWidth className="mb-4">
                <InputLabel>검색 결과 수</InputLabel>
                <Select
                  value={searchCount}
                  onChange={(e) => setSearchCount(Number(e.target.value))}
                  label="검색 결과 수"
                  className="rounded-xl"
                >
                  <MenuItem value={3}>3개</MenuItem>
                  <MenuItem value={5}>5개</MenuItem>
                  <MenuItem value={10}>10개</MenuItem>
                </Select>
              </FormControl>

              <Box className="mb-4">
                <Typography variant="subtitle2" className="font-semibold mb-2 text-gray-700 flex items-center gap-2">
                  <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  콘텐츠 길이: 
                  <Chip 
                    label={`${contentLength.toLocaleString()}자`} 
                    size="small" 
                    className="bg-blue-100 text-blue-800 font-semibold"
                  />
                </Typography>
                <Slider
                  value={contentLength}
                  onChange={(_, value) => setContentLength(value as number)}
                  min={500}
                  max={3000}
                  step={100}
                  valueLabelDisplay="auto"
                  sx={{
                    color: '#3b82f6',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#3b82f6',
                      '&:hover': {
                        boxShadow: '0 0 0 8px rgba(59, 130, 246, 0.16)',
                      },
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#3b82f6',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: '#e5e7eb',
                    },
                  }}
                />
              </Box>

              <Box className="space-y-3">
                <FormControlLabel
                  control={
                    <Switch
                      checked={useAdvancedMode}
                      onChange={(e) => setUseAdvancedMode(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#3b82f6',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#3b82f6',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" className="font-medium text-gray-700">
                      🧠 고급 분석 모드
                    </Typography>
                  }
                  className="bg-gray-50 rounded-lg p-2"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={includeKeywords}
                      onChange={(e) => setIncludeKeywords(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#3b82f6',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#3b82f6',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" className="font-medium text-gray-700">
                      <TagIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      키워드 최적화
                    </Typography>
                  }
                  className="bg-gray-50 rounded-lg p-2"
                />
              </Box>
            </CardContent>
          </Card>

          {searchResults.length > 0 && (
            <Card className="mt-4 shadow-lg border-0">
              <CardContent>
                <Typography variant="h6" className="font-bold mb-4 text-gray-800">
                  <SearchIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  검색 결과 ({searchResults.length}개)
                </Typography>
                <Box className="space-y-2 mb-4">
                  {searchResults.map((result, index) => (
                    <Box key={result.id} className="border-b border-gray-100 last:border-b-0 pb-2 last:pb-0">
                      <Typography variant="body2" className="font-medium text-gray-900 truncate">
                        {index + 1}. {result.title}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500 mt-1">
                        {result.description.slice(0, 60)}...
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Button
                  onClick={generateContent}
                  disabled={isGenerating}
                  variant="contained"
                  fullWidth
                  startIcon={<AIIcon />}
                  className="py-3 rounded-xl font-semibold"
                  sx={{
                    background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1d4ed8, #1e40af)',
                    },
                    '&:disabled': {
                      background: '#9ca3af'
                    }
                  }}
                >
                  {isGenerating ? '생성 중...' : 'AI 콘텐츠 생성'}
                </Button>
                
                {isGenerating && (
                  <Box className="mt-3">
                    <LinearProgress 
                      className="rounded-full h-2" 
                      sx={{
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                          borderRadius: '4px'
                        }
                      }}
                    />
                    <Typography variant="body2" className="text-center text-gray-600 mt-2">
                      AI가 콘텐츠를 생성하고 있습니다...
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Box>

        <Box className="w-full lg:w-3/4">
          {generatedContent ? (
            <div className="bg-white rounded-lg shadow-md border">
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    생성된 콘텐츠
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(generatedContent.content)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                      title="복사"
                    >
                      <ClipboardIcon sx={{ fontSize: 16 }} />
                    </button>
                    <button
                      onClick={downloadContent}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md"
                      title="다운로드"
                    >
                      <SaveIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                </div>

                {/* 제목 */}
                <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {generatedContent.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {generatedContent.summary}
                  </p>
                </div>

                {/* 키워드 */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    추출된 키워드:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.keywords.map((kw, index) => (
                      <button
                        key={index}
                        onClick={() => copyToClipboard(kw)}
                        className="px-3 py-1 text-sm bg-white text-blue-700 border border-blue-300 rounded-full hover:bg-blue-50"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 본문 */}
                <div className="p-4 mb-4 border border-gray-200 rounded-lg max-h-96 overflow-auto bg-gray-50">
                  <pre className="whitespace-pre-wrap font-inherit text-sm text-gray-800 leading-relaxed">
                    {generatedContent.content}
                  </pre>
                </div>

                {/* 통계 */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {generatedContent.content.length.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">글자 수</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {generatedContent.content.split('\n\n').length}
                      </div>
                      <div className="text-xs text-gray-500">문단 수</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {generatedContent.keywords.length}
                      </div>
                      <div className="text-xs text-gray-500">키워드</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.ceil(generatedContent.content.length / 500)}
                      </div>
                      <div className="text-xs text-gray-500">예상 읽기 시간(분)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] flex items-center justify-center bg-white rounded-lg shadow-md border">
              <div className="text-center text-gray-500">
                <div className="mb-4 opacity-30">
                  <DocumentIcon sx={{ fontSize: 96 }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  생성된 콘텐츠가 없습니다
                </h3>
                <p className="text-sm">
                  키워드를 검색하고 AI 콘텐츠 생성을 실행해보세요.
                </p>
              </div>
            </div>
          )}
        </Box>
      </Box>

      <Divider className="my-6" />

      <Card className="shadow-lg border-0">
        <CardContent>
          <Typography variant="h6" className="font-bold mb-4 text-gray-800">
            <BookIcon sx={{ fontSize: 20, mr: 1 }} />
            사용 방법
          </Typography>
          <Box className="text-sm text-gray-600 leading-relaxed space-y-2">
            <Typography variant="body2"><strong>1. 키워드 입력:</strong> 콘텐츠를 생성할 주제나 키워드를 입력하세요</Typography>
            <Typography variant="body2"><strong>2. 블로그 검색:</strong> 네이버 블로그에서 관련 포스트들을 자동으로 검색합니다</Typography>
            <Typography variant="body2"><strong>3. AI 생성:</strong> 검색된 내용을 바탕으로 고품질 콘텐츠를 자동 생성합니다</Typography>
            <Typography variant="body2"><strong>4. 편집 및 활용:</strong> 생성된 콘텐츠를 복사하거나 파일로 다운로드하세요</Typography>
            <br/>
            <Typography variant="body2" className="text-blue-600 flex items-center">
              <LightbulbIcon sx={{ fontSize: 16, mr: 0.5 }} />
              <strong>팁:</strong> 구체적이고 명확한 키워드를 입력할수록 더 정확한 콘텐츠가 생성됩니다!
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ContentGenerator;