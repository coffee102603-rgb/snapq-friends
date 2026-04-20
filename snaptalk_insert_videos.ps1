# ============================================================
# SnapTalk에 3개 영상 자동 삽입 스크립트
# ============================================================

cd C:\Users\최정은\snaptalk

Write-Host "`n📄 원본 파일 읽기..." -ForegroundColor Cyan
$content = Get-Content snaptalk-youtube-lab.html -Encoding UTF8

Write-Host "📏 현재 파일 줄 수: $($content.Length)" -ForegroundColor Yellow

# Line 1041 찾기: "],kr:[" 가 있는 줄
$insertLineIdx = -1
for ($i = 1035; $i -lt 1050; $i++) {
    if ($content[$i] -match "\],kr:\[") {
        $insertLineIdx = $i
        Write-Host "`n🎯 발견! Line $($i + 1): '`],kr:`['" -ForegroundColor Green
        break
    }
}

if ($insertLineIdx -eq -1) {
    Write-Host "❌ '],kr:[' 를 찾을 수 없습니다!" -ForegroundColor Red
    Write-Host "수동으로 확인 필요" -ForegroundColor Red
    exit
}

# 3개 영상 코드 (여기에 삽입)
$newVideos = @'
  {id:'K56O5RdE3KM',title:'How Dalgona Candy Is Made',cat:'food',catIcon:'🍔',diff:'intermediate',dubs:100,
   sentences:[{en:"This is Dalgona candy,",ko:"이건 달고나 사탕이에요,",start:0.16,end:1.109,core:'candy',highlight:'Dalgona candy',koHighlight:'달고나 사탕'},{en:"the popular Korean street snack seen in the TV series Squid Game.",ko:"TV 시리즈 오징어 게임에 나온 인기 있는 한국 길거리 간식이죠.",start:1.191,end:4.033,core:'snack',highlight:'street snack',koHighlight:'길거리 간식'},{en:"It's made by melting down sugar until it turns a caramel color and then",ko:"설탕을 카라멜 색이 될 때까지 녹여서 만들고,",start:4.115,end:7.227,core:'melting',highlight:'melting down sugar',koHighlight:'설탕을 녹여서'},{en:"adding in a few pinches of baking soda,",ko:"베이킹 소다를 몇 꼬집 넣어주면,",start:7.309,end:8.981,core:'adding',highlight:'adding baking soda',koHighlight:'베이킹 소다를 넣어주면'},{en:"where it then becomes very light and foamy.",ko:"아주 가볍고 부풀어 오르게 돼요.",start:9.063,end:10.916,core:'foamy',highlight:'light and foamy',koHighlight:'가볍고 부풀어 오르게'},{en:"This is dropped onto a flat surface where it's pressed down and lightly",ko:"이걸 평평한 표면에 떨어뜨려서 눌러주고,",start:10.998,end:14.109,core:'pressed',highlight:'pressed down',koHighlight:'눌러주고'},{en:"stamped with a cookie cutter mold.",ko:"쿠키 커터 틀로 가볍게 찍어줘요.",start:14.191,end:15.639,core:'stamped',highlight:'stamped with mold',koHighlight:'틀로 찍어줘요'},{en:"As you can see, I chose the umbrella shape,",ko:"보시다시피, 저는 우산 모양을 선택했어요,",start:15.721,end:17.448,core:'chose',highlight:'chose umbrella shape',koHighlight:'우산 모양을 선택했어요'},{en:"and once you're handed the Dalgona,",ko:"그리고 달고나를 받으면,",start:17.53,end:18.92,core:'handed',highlight:'handed the Dalgona',koHighlight:'달고나를 받으면'},{en:"the goal is to use a toothpick to carve out the shape in the",ko:"목표는 이쑤시개로 가운데의 모양을 파내는 거예요,",start:19.002,end:21.445,core:'carve',highlight:'carve out shape',koHighlight:'모양을 파내는'},{en:"center so it looks like this,",ko:"이렇게 보이도록 말이죠,",start:21.527,end:22.665,core:'looks',highlight:'looks like this',koHighlight:'이렇게 보이도록'},{en:"but unfortunately I dropped it on the floor and lost immediately.",ko:"하지만 불행히도 저는 바닥에 떨어뜨려서 바로 졌어요.",start:22.747,end:25.44,core:'dropped',highlight:'dropped on floor',koHighlight:'바닥에 떨어뜨려서'}]},
  {id:'hBchw5-EQrI',title:'World\'s Most Expensive Pizza',cat:'food',catIcon:'🍔',diff:'intermediate',dubs:150,
   sentences:[{en:"This is the world's largest pizza, but",ko:"이게 세계에서 가장 큰 피자인데",start:0.16,end:3.76,core:'largest',highlight:'world\'s largest pizza',koHighlight:'세계에서 가장 큰 피자'},{en:"how much does it cost? Can I order the",ko:"얼마나 할까요? 제가 주문할 수 있을까요",start:2.32,end:5.759,core:'cost',highlight:'how much cost',koHighlight:'얼마나 하다'},{en:"giant Sicilian and put everything you",ko:"자이언트 시실리안에 있는 모든 걸",start:3.76,end:7.44,core:'giant',highlight:'giant Sicilian',koHighlight:'자이언트 시실리안'},{en:"have on it? Bankrupt me. Sure.",ko:"다 올려주세요? 파산시켜 주세요. 알겠습니다.",start:5.759,end:8.72,core:'bankrupt',highlight:'bankrupt me',koHighlight:'파산시키다'},{en:">> Yeah, I'm sure. Do you mind if I put",ko:"네, 확실해요. 제가 달아도 될까요",start:7.44,end:10.24,core:'mind',highlight:'do you mind',koHighlight:'괜찮으세요'},{en:"this camera on your hat? Yeah. Thank you",ko:"이 카메라를 모자에? 네. 감사합니다",start:8.72,end:12.24,core:'camera',highlight:'camera on hat',koHighlight:'카메라를 모자에'},{en:"so much. All right. Good luck, man. That",ko:"정말 감사해요. 좋아요. 잘 부탁드려요. 그게",start:10.24,end:14.24,core:'luck',highlight:'good luck',koHighlight:'행운을 빌어요'},{en:"was so incredibly expensive. I'll tell",ko:"엄청나게 비쌌어요. 제가 말씀드릴게요",start:12.24,end:15.519,core:'expensive',highlight:'incredibly expensive',koHighlight:'엄청나게 비싸다'},{en:"you guys what the price was at the end.",ko:"여러분께 가격이 얼마였는지 마지막에 알려드릴게요.",start:14.24,end:16.72,core:'price',highlight:'the price',koHighlight:'가격'},{en:"Oh, he's going. Dude, he's playing the",ko:"오, 시작했어요. 이봐요, 그가 치고 있어요",start:15.519,end:18.24,core:'playing',highlight:'playing the drums',koHighlight:'드럼을 치다'},{en:"drums on the dough right now. He's doing",ko:"지금 반죽 위에서 드럼을요. 그가 하고 있어요",start:16.72,end:19.76,core:'dough',highlight:'drums on dough',koHighlight:'반죽 위에서 드럼'},{en:"the stretchy thing with his hand. Such a",ko:"손으로 늘리는 거를요. 정말",start:18.24,end:20.8,core:'stretchy',highlight:'stretchy thing',koHighlight:'늘리는 것'},{en:"professional. Normally, it would be",ko:"프로페셔널이에요. 보통은",start:19.76,end:22.24,core:'professional',highlight:'such a professional',koHighlight:'정말 전문가'},{en:"impossible for me to see what's going on",ko:"제가 무슨 일이 일어나는지 보는 게 불가능할 텐데",start:20.8,end:23.439,core:'impossible',highlight:'impossible to see',koHighlight:'볼 수 없다'},{en:"in the back of the kitchen, but thanks",ko:"주방 뒤쪽에서요, 하지만 감사하게도",start:22.24,end:25.68,core:'kitchen',highlight:'back of kitchen',koHighlight:'주방 뒤쪽'},{en:"to the Insta 360 Go Ultra, I can see",ko:"인스타 360 고 울트라 덕분에, 제가 볼 수 있어요",start:23.439,end:27.119,core:'see',highlight:'can see everything',koHighlight:'다 볼 수 있다'},{en:"everything. I don't know how long it's",ko:"모든 걸요. 얼마나 걸릴지 모르겠어요",start:25.68,end:28.24,core:'long',highlight:'how long',koHighlight:'얼마나 오래'},{en:"going to take, and I have no idea what",ko:"그리고 전혀 모르겠어요",start:27.119,end:29.199,core:'idea',highlight:'no idea',koHighlight:'모르다'},{en:"this is going to cost. Dude, they're",ko:"이게 얼마나 할지요. 이봐요, 그들이",start:28.24,end:31.039,core:'cost',highlight:'going to cost',koHighlight:'비용이 들다'},{en:"just grabbing the whole tubs of their",ko:"그냥 통째로 집어들고 있어요",start:29.199,end:32.88,core:'grabbing',highlight:'grabbing whole tubs',koHighlight:'통째로 집다'},{en:"ingredients and just dumping it on this",ko:"재료들을 그냥 붓고 있어요",start:31.039,end:33.76,core:'dumping',highlight:'dumping ingredients',koHighlight:'재료를 붓다'},{en:"thing.",ko:"이거 위에요.",start:32.88,end:35.52,core:'thing',highlight:'on this thing',koHighlight:'이거 위에'},{en:">> The pizza is bar.",ko:"피자가 바예요.",start:33.76,end:37.44,core:'bar',highlight:'pizza is bar',koHighlight:'피자가 바'},{en:">> The oven door is literally open while",ko:"오븐 문이 말 그대로 열려 있어요",start:35.52,end:38.879,core:'open',highlight:'oven door open',koHighlight:'오븐 문이 열리다'},{en:"it's cooking. They cannot close the",ko:"조리하는 동안요. 그들은 닫을 수가 없어요",start:37.44,end:40.239,core:'cooking',highlight:'while cooking',koHighlight:'조리하는 동안'},{en:"oven. There's a very decent chance this",ko:"오븐을요. 꽤 높은 확률로 이게",start:38.879,end:42.32,core:'chance',highlight:'decent chance',koHighlight:'상당한 가능성'},{en:"is over 1,000 bucks. Thankfully, Instant",ko:"천 달러가 넘을 거예요. 다행히도, 인스턴트",start:40.239,end:43.84,core:'bucks',highlight:'1,000 bucks',koHighlight:'천 달러'},{en:"360 actually sponsored this video. So,",ko:"360이 실제로 이 영상을 후원했어요. 그래서",start:42.32,end:44.719,core:'sponsored',highlight:'sponsored this video',koHighlight:'영상을 후원하다'},{en:"if you guys want to check them out,",ko:"여러분이 확인하고 싶으시다면",start:43.84,end:46.079,core:'check',highlight:'check them out',koHighlight:'확인하다'},{en:"check out the pin comment. Oh, it's",ko:"고정 댓글을 확인하세요. 오, 그게",start:44.719,end:47.68,core:'comment',highlight:'pin comment',koHighlight:'고정 댓글'}]},
  {id:'8UpxiFOnNj8',title:'MrBeast\'s Perfect Steak',cat:'food',catIcon:'🍔',diff:'intermediate',dubs:200,
   sentences:[{en:"Nick.",ko:"닉.",start:4.94,end:5.77,core:'Nick',highlight:'Nick',koHighlight:'닉'},{en:"Jimmy, what's up?",ko:"지미, 무슨 일이야?",start:5.852,end:6.682,core:'up',highlight:'what\'s up',koHighlight:'무슨 일이야'},{en:"It happened again.",ko:"또 일어났어.",start:6.764,end:7.594,core:'happened',highlight:'happened again',koHighlight:'또 일어났어'},{en:"Wait right there.",ko:"거기서 기다려.",start:7.676,end:8.506,core:'wait',highlight:'wait right there',koHighlight:'거기서 기다려'},{en:"Okay.",ko:"알겠어.",start:8.68,end:9.66,core:'Okay',highlight:'Okay',koHighlight:'알겠어'},{en:"That's me.",ko:"그게 나야.",start:13.36,end:14.19,core:'me',highlight:'that\'s me',koHighlight:'그게 나야'},{en:"Where is he?",ko:"그 사람 어디 있어?",start:21.41,end:23.143,core:'where',highlight:'where is',koHighlight:'어디 있어'},{en:"Yes. Thank you, man.",ko:"그래. 고마워, 친구.",start:33.231,end:35.243,core:'thank',highlight:'thank you',koHighlight:'고마워'},{en:"Jimmy, I'm serious, this is the last time. I'm not doing this again.",ko:"지미, 진심이야, 이게 마지막이야. 다시는 안 해.",start:35.243,end:37.364,core:'last',highlight:'the last time',koHighlight:'마지막'},{en:"Okay. Hopefully I don't run out.",ko:"알겠어. 다 떨어지지 않길 바라.",start:37.364,end:38.76,core:'run',highlight:'run out',koHighlight:'다 떨어지다'},{en:"Don't be lazy like Mr. Beast. Just go to your local Walmart instead.",ko:"미스터 비스트처럼 게으르게 굴지 마. 그냥 동네 월마트에 가.",start:38.842,end:41.941,core:'lazy',highlight:'be lazy',koHighlight:'게으르게 굴다'}]}
'@

# 이전 영상 끝 (Line 1040)의 "]}" 를 "]}," 로 변경
$prevLineIdx = $insertLineIdx - 1
$content[$prevLineIdx] = $content[$prevLineIdx] -replace "\]\}$", "]},"
Write-Host "`n✅ Line $($prevLineIdx + 1): 끝에 쉼표 추가" -ForegroundColor Green

# 새 영상을 기존 Line 1040 뒤, Line 1041 앞에 삽입
$before = $content[0..$prevLineIdx]
$after = $content[$insertLineIdx..($content.Length - 1)]
$newContent = $before + $newVideos + $after

Write-Host "`n💾 파일 저장 중..." -ForegroundColor Cyan
$newContent | Out-File snaptalk-youtube-lab.html -Encoding UTF8

Write-Host "`n✅ 삽입 완료!" -ForegroundColor Green
Write-Host "📏 새 파일 줄 수: $($newContent.Length)" -ForegroundColor Yellow
Write-Host "➕ 추가된 줄: $($newContent.Length - $content.Length)" -ForegroundColor Yellow

Write-Host "`n🔍 검증: 삽입된 영상 ID 검색..." -ForegroundColor Cyan
$verifyContent = Get-Content snaptalk-youtube-lab.html -Encoding UTF8
foreach ($id in @("K56O5RdE3KM", "hBchw5-EQrI", "8UpxiFOnNj8")) {
    for ($i = 0; $i -lt $verifyContent.Length; $i++) {
        if ($verifyContent[$i] -match $id) {
            Write-Host "  ✓ $id`: Line $($i + 1)" -ForegroundColor Green
            break
        }
    }
}

Write-Host "`n🎉 완료! 다음 단계: Git push!" -ForegroundColor Magenta
