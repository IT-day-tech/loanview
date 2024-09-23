<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>소상공인 대출 심사보고서</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <style>
        .modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
        }
        .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-height: 80%;
            overflow-y: auto;
        }
        .loading-modal {
            display: none;
            position: fixed;
            z-index: 2;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
            text-align: center;
            color: white;
            font-size: 2em;
            padding-top: 20%;
        }
        .uploading-modal {
            display: none;
            position: fixed;
            z-index: 2;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
            text-align: center;
            color: white;
            font-size: 2em;
            padding-top: 20%;
        }
        @media print {
            body * {
                visibility: hidden;
            }
            .modal-content, .modal-content * {
                visibility: visible;
            }
            .modal-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: auto;
                overflow: visible;
            }
        }
    </style>
</head>
<body class="bg-blue-100">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-center mb-4">소상공인 대출 심사보고서</h1>
        <p class="text-center text-red-500 mb-8">※ 새로운 업체를 입력할 때는 새로고침 해주세요</p>
        
        <div class="flex justify-center space-x-4 mb-8">
            <input type="file" id="mydata-pdf" accept=".pdf,.jpg,.png" style="display: none;">
            <button onclick="document.getElementById('mydata-pdf').click()" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                마이데이터 PDF 업로드
            </button>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 class="text-2xl font-bold mb-4">업체 정보</h2>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="company-name">
                        업체명(상호)
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="company-name" type="text" placeholder="업체명">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="business-number">
                        사업자등록번호
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="business-number" type="text" placeholder="사업자등록번호">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="representative">
                        대표자명
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="representative" type="text" placeholder="대표자명">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="business-type">
                        경영형태구분
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="business-type" type="text" placeholder="경영형태구분">
                </div>
                <div class="col-span-2">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="address">
                        사업장주소
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="address" type="text" placeholder="사업장주소">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="opening-date">
                        개업일자
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="opening-date" type="text" placeholder="개업일자">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="tax-type">
                        과세유형
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="tax-type" type="text" placeholder="과세유형">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="business-category">
                        업태
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="business-category" type="text" placeholder="업태">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="business-item">
                        종목
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="business-item" type="text" placeholder="종목">
                </div>
            </div>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 class="text-2xl font-bold mb-4">재무 정보</h2>
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2" for="recent-sales">
                    매출액
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="recent-sales" type="text" placeholder="매출액">
            </div>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 class="text-2xl font-bold mb-4">재무비율 정보</h2>
            <textarea id="financial-ratio-info" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32" placeholder="재무비율 정보를 입력하세요"></textarea>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 class="text-2xl font-bold mb-4">종합 의견</h2>
            <textarea id="general-opinion" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32" placeholder="종합 의견을 입력하세요"></textarea>
        </div>

        <div class="flex justify-center space-x-4">
            <button onclick="generateReport()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                보고서 생성
            </button>
        </div>
    </div>

    <div id="report-modal" class="modal">
        <div class="modal-content">
            <span onclick="closeModal()" class="close">&times;</span>
            <h2 class="text-2xl font-bold mb-4">대출 심사 보고서</h2>
            <div id="report-content" class="whitespace-pre-wrap"></div>
            <div class="flex justify-end space-x-4 mt-4">
                <button onclick="printReport()" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    인쇄
                </button>
                <button onclick="saveReport()" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                    저장
                </button>
                <button onclick="closeModal()" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    닫기
                </button>
            </div>
        </div>
    </div>

    <div id="loading-modal" class="loading-modal">
        보고서 생성 중입니다...
    </div>

    <div id="uploading-modal" class="loading-modal">
        파일 업로드 중입니다...
    </div>

    <script>
        // PDF 및 이미지 파일 업로드 처리
        document.getElementById('mydata-pdf').addEventListener('change', handleFileUpload);

        function handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                document.getElementById('uploading-modal').style.display = "block";

                axios.post('http://localhost:3000/api/upload', formData)
                    .then(response => {
                        document.getElementById('uploading-modal').style.display = "none";
                        const data = response.data;
                        alert(data.message);
                        fillForm(data.analysis);
                    })
                    .catch(error => {
                        document.getElementById('uploading-modal').style.display = "none";
                        console.error('Error:', error);
                    });
            }
        }

        function fillForm(data) {
            const fields = {
                'company-name': '업체명',
                'business-number': '사업자등록번호',
                'representative': '대표자명',
                'business-type': '경영형태구분',
                'address': '사업장주소',
                'opening-date': '개업일자',
                'tax-type': '과세유형',
                'business-category': '업태',
                'business-item': '종목',
                'recent-sales': '매출액'
            };

            for (const [fieldId, dataKey] of Object.entries(fields)) {
                const field = document.getElementById(fieldId);
                if (field && !field.value) {
                    if (dataKey === '매출액') {
                        field.value = JSON.stringify(data[dataKey], null, 2);
                    } else {
                        field.value = data[dataKey] || '';
                    }
                }
            }

            if (data['재무비율']) {
                document.getElementById('financial-ratio-info').value = data['재무비율'];
            }
        }

        function generateReport() {
            const companyInfo = {
                'company-name': document.getElementById('company-name').value,
                'business-number': document.getElementById('business-number').value,
                'representative': document.getElementById('representative').value,
                'business-type': document.getElementById('business-type').value,
                'address': document.getElementById('address').value,
                'opening-date': document.getElementById('opening-date').value,
                'tax-type': document.getElementById('tax-type').value,
                'business-category': document.getElementById('business-category').value,
                'business-item': document.getElementById('business-item').value
            };

            const financialInfo = {
                'recent-sales': document.getElementById('recent-sales').value
            };

            const financialRatioInfo = document.getElementById('financial-ratio-info').value;
            const generalOpinion = document.getElementById('general-opinion').value;

            document.getElementById('loading-modal').style.display = "block";

            axios.post('http://localhost:3000/api/generate-report', {
                companyInfo,
                financialInfo,
                financialRatioInfo,
                generalOpinion
            })
            .then(response => {
                document.getElementById('loading-modal').style.display = "none";
                document.getElementById('report-content').innerHTML = `<pre>${response.data}</pre>`;
                document.getElementById('report-modal').style.display = "block";
            })
            .catch(error => {
                document.getElementById('loading-modal').style.display = "none";
                console.error('Error:', error);
            });
        }

        function closeModal() {
            document.getElementById('report-modal').style.display = "none";
        }

        function printReport() {
            window.print();
        }

        function saveReport() {
            const reportContent = document.getElementById('report-content').innerText;
            const blob = new Blob([reportContent], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = '대출심사보고서.txt';
            link.click();
        }
    </script>
</body>
</html>
