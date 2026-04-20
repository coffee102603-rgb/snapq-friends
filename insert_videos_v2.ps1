# ============================================================
# SnapTalk 3개 영상 자동 삽입 v2 (안전 버전!)
# - BOM 없는 UTF-8 사용
# - 단순 문자열 치환
# - 백업 자동 생성
# ============================================================

Set-Location "C:\Users\최정은\snaptalk"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " SnapTalk 3개 영상 자동 삽입 v2" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# ==========================================
# STEP 1: 백업 (안전!)
# ==========================================
$backupName = "snaptalk-youtube-lab.BEFORE-INSERT.html"
Write-Host "[1/5] 백업 생성 중..." -ForegroundColor Yellow
Copy-Item "snaptalk-youtube-lab.html" $backupName -Force
Write-Host "      백업 완료: $backupName" -ForegroundColor Green
Write-Host ""

# ==========================================
# STEP 2: 원본 파일 읽기 (BOM 없는 UTF-8)
# ==========================================
Write-Host "[2/5] HTML 파일 읽기..." -ForegroundColor Yellow
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$html = [System.IO.File]::ReadAllText("C:\Users\최정은\snaptalk\snaptalk-youtube-lab.html", $utf8NoBom)
Write-Host "      파일 크기: $($html.Length) 글자" -ForegroundColor Green
Write-Host ""

# ==========================================
# STEP 3: 영상 코드 읽기
# ==========================================
Write-Host "[3/5] 3개 영상 코드 읽기..." -ForegroundColor Yellow
$videosPath = "C:\Users\최정은\snaptalk\snaptalk_videos.txt"
if (-not (Test-Path $videosPath)) {
    Write-Host "      ERROR: snaptalk_videos.txt 파일이 없습니다!" -ForegroundColor Red
    Write-Host "      바탕화면에서 snaptalk 폴더로 복사했나요?" -ForegroundColor Red
    exit 1
}
$newVideos = [System.IO.File]::ReadAllText($videosPath, $utf8NoBom)
Write-Host "      영상 코드 크기: $($newVideos.Length) 글자" -ForegroundColor Green
Write-Host ""

# ==========================================
# STEP 4: 문자열 치환 (핵심!)
# ==========================================
Write-Host "[4/5] 영상 삽입 중..." -ForegroundColor Yellow

# us 배열 끝 찾기: "   ]}\r\n],kr:["  
# (Windows 줄바꿈 CRLF)
$oldPattern1 = "   ]}`r`n],kr:["
$oldPattern2 = "   ]}`n],kr:["  # Unix 줄바꿈도 시도

# 새 패턴: "   ]},\r\n{영상1},\r\n{영상2},\r\n{영상3}\r\n],kr:["
$newContent1 = "   ]},`r`n" + $newVideos.TrimEnd() + "`r`n],kr:["
$newContent2 = "   ]},`n" + $newVideos.TrimEnd() + "`n],kr:["

# 치환 시도
$replaced = $false

if ($html.Contains($oldPattern1)) {
    $html = $html.Replace($oldPattern1, $newContent1)
    $replaced = $true
    Write-Host "      CRLF 패턴으로 삽입 성공!" -ForegroundColor Green
} elseif ($html.Contains($oldPattern2)) {
    $html = $html.Replace($oldPattern2, $newContent2)
    $replaced = $true
    Write-Host "      LF 패턴으로 삽입 성공!" -ForegroundColor Green
}

if (-not $replaced) {
    Write-Host ""
    Write-Host "      ERROR: '],kr:[' 패턴을 찾을 수 없습니다!" -ForegroundColor Red
    Write-Host "      백업에서 복원: copy $backupName snaptalk-youtube-lab.html -Force" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# ==========================================
# STEP 5: 파일 저장 (BOM 없는 UTF-8!)
# ==========================================
Write-Host "[5/5] 파일 저장 중 (BOM 없는 UTF-8)..." -ForegroundColor Yellow
[System.IO.File]::WriteAllText("C:\Users\최정은\snaptalk\snaptalk-youtube-lab.html", $html, $utf8NoBom)
$newSize = (Get-Item "snaptalk-youtube-lab.html").Length
Write-Host "      저장 완료! 새 파일 크기: $newSize bytes" -ForegroundColor Green
Write-Host ""

# ==========================================
# 검증
# ==========================================
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " 검증: 삽입된 영상 ID 확인" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

$verifyContent = Get-Content "snaptalk-youtube-lab.html" -Encoding UTF8
$ids = @("K56O5RdE3KM", "hBchw5-EQrI", "8UpxiFOnNj8")
$titles = @("Dalgona Candy", "Expensive Pizza", "MrBeast Steak")

$allFound = $true
for ($j = 0; $j -lt $ids.Length; $j++) {
    $id = $ids[$j]
    $title = $titles[$j]
    $found = $false
    for ($i = 0; $i -lt $verifyContent.Length; $i++) {
        if ($verifyContent[$i] -match $id) {
            Write-Host "  OK [$title]: Line $($i + 1)" -ForegroundColor Green
            $found = $true
            break
        }
    }
    if (-not $found) {
        Write-Host "  MISSING [$title]: NOT FOUND!" -ForegroundColor Red
        $allFound = $false
    }
}

Write-Host ""
if ($allFound) {
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host " 성공! 3개 영상 삽입 완료!" -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "다음 단계:" -ForegroundColor Cyan
    Write-Host "  git add snaptalk-youtube-lab.html" -ForegroundColor White
    Write-Host "  git commit -m 'feat: Add 3 Food videos (Dalgona, Pizza, Steak)'" -ForegroundColor White
    Write-Host "  git push" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "일부 영상이 누락되었습니다. 백업에서 복원하세요:" -ForegroundColor Yellow
    Write-Host "  copy $backupName snaptalk-youtube-lab.html -Force" -ForegroundColor White
}
