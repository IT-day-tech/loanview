const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { createWorker } = require('tesseract.js');
const pdf = require('pdf-parse');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: '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' // 여기에 실제 OpenAI API 키를 입력하세요
});

// 기본 경로 처리 추가
app.get('/', (req, res) => {
    res.send('서버가 정상적으로 실행 중입니다.');
});

async function performOCR(filePath) {
    const worker = createWorker();
    await worker.load();
    const { data: { text } } = await worker.recognize(filePath);
    await worker.terminate();
    return text;
}

async function processPDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
}

async function summarizeText(text) {
    const messages = [
        { role: "system", content: "당신은 도움이 되는 조수입니다." },
        { role: "user", content: `다음 텍스트를 요약해 주세요:\n\n${text}` }
    ];
    
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages,
        max_tokens: 1000
    });

    const responseContent = response.choices[0].message.content.trim();
    console.log('OpenAI 응답:', responseContent);

    return responseContent;
}

async function analyzeText(text) {
    const messages = [
        { role: "system", content: "당신은 대출심사자입니다." },
        { role: "user", content: `다음 텍스트에서 업체명, 사업자등록번호, 대표자명, 경영형태구분, 사업장주소, 개업일자, 과세유형, 업태, 종목, 매출액에 관련된 정보를 추출하고 JSON 형식으로 정리해주세요. JSON 형식만 반환해주세요:\n\n${text}` }
    ];
    
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages,
        max_tokens: 1000
    });

    const responseContent = response.choices[0].message.content.trim();
    console.log('OpenAI 응답:', responseContent);

    // JSON 형식이 올바른지 확인
    if (responseContent.startsWith('{') && responseContent.endsWith('}')) {
        try {
            return JSON.parse(responseContent);
        } catch (error) {
            console.error('JSON 파싱 오류:', error);
            console.error('파싱 실패한 응답:', responseContent);
            throw new Error('응답을 JSON으로 파싱하는 중 오류가 발생했습니다.');
        }
    } else {
        console.error('응답이 JSON 형식이 아닙니다:', responseContent);
        throw new Error('응답이 JSON 형식이 아닙니다.');
    }
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        const { file } = req;
        let text;
        
        if (path.extname(file.originalname).toLowerCase() === '.pdf') {
            text = await processPDF(file.path);
        } else {
            text = await performOCR(file.path);
        }
        
        const analysis = await analyzeText(text);

        res.json({ message: '파일 업로드 및 분석이 완료되었습니다.', analysis });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '파일 처리 중 오류가 발생했습니다.' });
    } finally {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
    }
});

app.post('/api/generate-report', async (req, res) => {
    try {
        const { companyInfo, financialInfo, financialRatioInfo, generalOpinion } = req.body;
        
        const messages = [
            { role: "system", content: "당신은 대출심사자입니다." },
            { role: "user", content: `다음 정보를 바탕으로 소상공인 대출 심사보고서를 작성해주세요:
            
            업체 정보: ${JSON.stringify(companyInfo)}
            재무 정보: ${JSON.stringify(financialInfo)}
            재무비율 정보: ${financialRatioInfo}
            종합 의견: ${generalOpinion}
            
            보고서는 다음 형식을 따라주세요:
            1. 업체 개요(~합니다. 가아닌 ~함 식으로 표현)
            2. 재무 상태 분석(~합니다. 가 아닌 ~함 식으로 표현하고 매출액부분은 숫자로 표시)
            3. 재무비율 분석 (성장성, 수익성, 안정성, 활동성 항목을 구체적으로 분석 및 재무위험분석 포함하여 구체적으로 작성, 비율같은 표시형식 지켜주세요)
            4. 종합 의견 (업체 개요, 재무 상태 분석, 재무비율 분석을 통해 최종 의견 작성)
            ` }
        ];
        
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: messages,
            max_tokens: 1000
        });

        const responseContent = response.choices[0].message.content.trim();
        console.log('OpenAI 응답:', responseContent);

        res.json(responseContent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '보고서 생성 중 오류가 발생했습니다.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`));