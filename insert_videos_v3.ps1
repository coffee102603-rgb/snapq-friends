# ============================================================
# SnapTalk 3개 영상 자동 삽입 v3
# - 한글 경로 문제 해결!
# - 상대 경로만 사용
# - 현재 폴더에서 작업
# ============================================================

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " SnapTalk 3 Video Auto Insert v3" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# 현재 폴더 확인
$currentPath = (Get-Location).Path
Write-Host "Current folder: $currentPath" -ForegroundColor White
Write-Host ""

# 필요 파일 확인
if (-not (Test-Path ".\snaptalk-youtube-lab.html")) {
    Write-Host "ERROR: snaptalk-youtube-lab.html not found in current folder!" -ForegroundColor Red
    Write-Host "Please run 'cd C:\Users\max정은\snaptalk' first" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path ".\snaptalk_videos.txt")) {
    Write-Host "ERROR: snaptalk_videos.txt not found!" -ForegroundColor Red
    exit 1
}

# ==========================================
# STEP 1: 백업
# ==========================================
Write-Host "[1/5] Creating backup..." -ForegroundColor Yellow
Copy-Item ".\snaptalk-youtube-lab.html" ".\snaptalk-youtube-lab.BEFORE-INSERT.html" -Force
Write-Host "      Backup created: snaptalk-youtube-lab.BEFORE-INSERT.html" -ForegroundColor Green
Write-Host ""

# ==========================================
# STEP 2: HTML 파일 읽기 (상대 경로!)
# ==========================================
Write-Host "[2/5] Reading HTML file..." -ForegroundColor Yellow
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# 절대 경로로 변환 (한글 문제 회피)
$htmlPath = (Resolve-Path ".\snaptalk-youtube-lab.html").Path
$html = [System.IO.File]::ReadAllText($htmlPath, $utf8NoBom)
Write-Host "      File size: $($html.Length) chars" -ForegroundColor Green
Write-Host ""

# ==========================================
# STEP 3: 영상 코드 읽기
# ==========================================
Write-Host "[3/5] Reading videos code..." -ForegroundColor Yellow
$videosPath = (Resolve-Path ".\snaptalk_videos.txt").Path
$newVideos = [System.IO.File]::ReadAllText($videosPath, $utf8NoBom)
Write-Host "      Videos code size: $($newVideos.Length) chars" -ForegroundColor Green
Write-Host ""

# ==========================================
# STEP 4: 문자열 치환 (핵심!)
# ==========================================
Write-Host "[4/5] Inserting videos..." -ForegroundColor Yellow

# us 배열 끝 찾기: 여러 패턴 시도
$patterns = @(
    "   ]}`r`n],kr:[",  # CRLF
    "   ]}`n],kr:[",    # LF
    "   ]}],kr:[",      # No newline
    "]}`r`n],kr:[",     # No indent, CRLF
    "]}`n],kr:["        # No indent, LF
)

$newContents = @(
    "   ]},`r`n" + $newVideos.TrimEnd() + "`r`n],kr:[",
    "   ]},`n" + $newVideos.TrimEnd() + "`n],kr:[",
    "   ]}," + $newVideos.TrimEnd() + "],kr:[",
    "]},`r`n" + $newVideos.TrimEnd() + "`r`n],kr:[",
    "]},`n" + $newVideos.TrimEnd() + "`n],kr:["
)

$replaced = $false
for ($i = 0; $i -lt $patterns.Length; $i++) {
    if ($html.Contains($patterns[$i])) {
        $html = $html.Replace($patterns[$i], $newContents[$i])
        $replaced = $true
        Write-Host "      Pattern $($i+1) matched! Insert success!" -ForegroundColor Green
        break
    }
}

if (-not $replaced) {
    Write-Host ""
    Write-Host "      ERROR: Could not find ],kr:[ pattern!" -ForegroundColor Red
    Write-Host "      Restore: copy snaptalk-youtube-lab.BEFORE-INSERT.html snaptalk-youtube-lab.html -Force" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# ==========================================
# STEP 5: 파일 저장
# ==========================================
Write-Host "[5/5] Saving file (UTF-8 no BOM)..." -ForegroundColor Yellow
[System.IO.File]::WriteAllText($htmlPath, $html, $utf8NoBom)
$newSize = (Get-Item ".\snaptalk-youtube-lab.html").Length
Write-Host "      Saved! New file size: $newSize bytes" -ForegroundColor Green
Write-Host ""

# ==========================================
# 검증
# ==========================================
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " Verification" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

$verifyContent = Get-Content ".\snaptalk-youtube-lab.html" -Encoding UTF8
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
    Write-Host " SUCCESS! 3 videos inserted!" -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps (copy and paste):" -ForegroundColor Cyan
    Write-Host '  git add snaptalk-youtube-lab.html' -ForegroundColor White
    Write-Host '  git commit -m "feat: Add 3 Food videos from Curator"' -ForegroundColor White
    Write-Host '  git push' -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "Some videos missing. Restoring..." -ForegroundColor Yellow
    Copy-Item ".\snaptalk-youtube-lab.BEFORE-INSERT.html" ".\snaptalk-youtube-lab.html" -Force
    Write-Host "Restored from backup." -ForegroundColor Green
}
