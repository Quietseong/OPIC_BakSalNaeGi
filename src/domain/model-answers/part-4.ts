import type { ModelAnswer } from "../types";

export const MODEL_ANSWERS_PART_4: ModelAnswer[] = [
  {
    questionId: "rp-hotel-ask",
    text: "Hi, good afternoon. I'm calling because I'm planning a weekend trip to Busan next month, and I'm thinking about staying at your hotel. I just have a few questions, if that's okay. First, could you tell me what kinds of rooms you have available for the second weekend of June? Oh, I see, so there are standard rooms and ocean-view rooms. Then I was wondering how much the ocean-view room is per night, and whether breakfast is included in that price. Okay, breakfast is extra. That's good to know. Is it possible to check in a little early, maybe around noon? I'm taking an early train, so that would really help. Oh, great, as long as the room is ready. And one more thing, do you happen to know if there's a parking lot or a nice cafe nearby? Perfect. Thank you so much for your help. I'll talk it over and call back to book by tomorrow. Have a nice day!",
    points: [
      "통화 목적 먼저 밝히기: 'I'm calling because I'm planning a weekend trip'",
      "질문 형태 다양화: 'Could you tell me ~' / 'I was wondering how much ~' / 'Is it possible to ~'",
      "답을 들은 듯한 짧은 반응: 'Oh, I see, so there are ~'",
    ],
  },
  {
    questionId: "rp-hotel-solve",
    text: "Excuse me, hi. I have a reservation under the name Kim for two nights, and I think there's been a problem. I booked a deluxe double room about a month ago, and I have the confirmation email right here on my phone. But you're telling me the room isn't ready yet, and on top of that, the room you're giving me is a small single room. That's not what I paid for. I've been traveling all morning, so I'm pretty tired. So, here's what I'd like to suggest. First, if a deluxe room will be ready in an hour or so, I can leave my bags here and wait at the cafe in the lobby. If that's not possible, could you move me to a different room that's at least the same size? Or, as a last option, I'd accept the smaller room if you give me a partial refund for the difference. I'd really appreciate it if you could sort this out quickly. Thank you for understanding.",
    points: [
      "문제를 구체적 근거와 함께 설명: 'I have the confirmation email right here on my phone'",
      "대안 단계적 제시: 'First, ~' / 'If that's not possible, ~' / 'Or, as a last option, ~'",
      "정중한 요청 마무리: 'I'd really appreciate it if you could ~'",
    ],
  },
  {
    questionId: "rp-hotel-exp",
    text: "Actually, yes, I had a pretty memorable problem at a guesthouse in Jeju about two years ago. I went there alone for a short break because work had been really stressful. When I arrived late at night, the owner said the heater in my room had broken that afternoon. It was January, so the room was freezing, and I didn't know what to do because it was too late to find another place. At first I was annoyed, but the owner was really apologetic. She brought me two extra blankets and an electric heater from her own house, and the next morning she moved me to a bigger room for free. She even gave me a discount on the second night. Looking back, I think that experience taught me something. Problems happen everywhere, but how people deal with them makes all the difference. That's why I still recommend that place to my friends, including Minji, who stayed there last summer.",
    points: [
      "과거완료로 시간 순서 표현: 'the heater in my room had broken that afternoon'",
      "감정 변화 묘사: 'At first I was annoyed, but ~'",
      "회고와 교훈으로 마무리: 'Looking back, ~' / 'That's why ~'",
    ],
  },
  {
    questionId: "rp-concert-tickets-ask",
    text: "Hello, is this the ticket office for the Seoul Jazz Festival? Great. I'm calling because I'd like to buy two tickets for my sister and me, and I have a few questions before I book. First, could you tell me if there are still seats available for the Saturday evening show? Oh, I see, only the second floor is left. That's fine. I was wondering how much the second-floor seats are, and whether there's any discount for buying online instead of at the box office. Oh, ten percent off online, that's nice. Is it possible to choose seats next to each other? We really want to sit together. Okay, good. And one last question. Do you happen to know how early the doors open, and whether we can bring drinks inside? Got it, doors open an hour before, and no outside drinks. Thank you so much. You've been really helpful. I'll book them online tonight.",
    points: [
      "상대 확인 후 용건 시작: 'Hello, is this the ticket office for ~?'",
      "간접 의문문으로 두 가지 묻기: 'I was wondering how much ~, and whether ~'",
      "들은 내용을 되짚는 반응: 'Got it, doors open an hour before'",
    ],
  },
  {
    questionId: "rp-concert-tickets-solve",
    text: "Hey Minji, it's me. Do you have a minute? I'm really sorry, but I have some bad news about the concert tonight. My team leader just called, and there's a serious problem with one of our services at work, so I have to go back to the office and fix it with the team. I don't know when I'll finish, so I don't think I can make it tonight. I feel terrible because we've been looking forward to this for months. So, here's what I was thinking. First, you could still go and take your cousin with you, and I'll just transfer my ticket to her on the app. Or, if you'd rather not go without me, I can try to sell both tickets on the official resale site and pay you back right away. Another option is that we buy tickets for their next show in November, and this time I'll pay for both. Just let me know what works best for you. Again, I'm really sorry.",
    points: [
      "현재완료진행으로 아쉬움 강조: 'we've been looking forward to this for months'",
      "대안 나열 구조: 'Or, if you'd rather not ~' / 'Another option is that ~'",
      "친구에게 맞는 부드러운 마무리: 'Just let me know what works best for you'",
    ],
  },
  {
    questionId: "rp-concert-tickets-exp",
    text: "Well, something like that happened last spring. My younger sister and I had planned a weekend trip to Gangneung for months. We'd booked the train tickets and a small guesthouse near the beach, and we were both really excited. But the night before we left, my sister got a high fever. At first she insisted she was fine, but I could tell she wasn't, so I decided we had to cancel. The tricky part was that the guesthouse had a strict cancellation policy. I called the owner, explained the situation honestly, and asked if we could change the dates instead of canceling. Luckily, he agreed to move our booking to the following month. I also changed our train tickets online, which only cost a small fee. In the end, we went three weeks later and the weather was even better. That experience taught me that it's always worth asking politely, because people are often more flexible than you expect.",
    points: [
      "과거완료로 배경 설정: 'We'd booked the train tickets and a small guesthouse'",
      "문제 핵심 짚기: 'The tricky part was that ~'",
      "결과와 교훈 연결: 'In the end, ~' / 'That experience taught me that ~'",
    ],
  },
  {
    questionId: "rp-car-rental-ask",
    text: "Hi, good morning. I'm calling because I'd like to rent a car for a short trip to Gangwon-do next weekend, from Friday to Sunday. I have a few questions before I make a reservation. First, could you tell me what kinds of cars you have available for those dates? Oh, I see, so you have compact cars and a few SUVs. Since I'm traveling alone, a compact car would probably be enough. I was wondering how much it costs per day, and whether insurance is included in that price. Okay, so full insurance is extra. That's good to know. Is it possible to pick up the car early on Friday morning, around seven? I want to avoid traffic. Oh, great. And one more thing, do you happen to know if the car comes with a navigation system, or should I just use my phone? Perfect, thank you. I think I'll go with the compact car. Could you send me the details by text? Thanks so much.",
    points: [
      "이유를 덧붙인 판단: 'Since I'm traveling alone, a compact car would probably be enough'",
      "질문 형태 다양화: 'Is it possible to ~' / 'do you happen to know if ~'",
      "결정과 후속 요청으로 마무리: 'I think I'll go with ~. Could you send me ~?'",
    ],
  },
  {
    questionId: "rp-car-rental-solve",
    text: "Hello, I'm calling about a car I rented from your Gangneung branch this morning. The reservation is under Kim, and it's a white compact car. I'm sorry to bother you, but the car just broke down on the road. About twenty minutes ago, a warning light came on, and then the engine suddenly stopped. Luckily I managed to pull over safely, so I'm fine, but I'm now on a local road near Jumunjin Beach and the car won't start at all. I really need your help because I have a hotel booked in Sokcho tonight. So, here are a few options. First, could you send a tow truck and a replacement car here? If that's going to take too long, maybe I could take a taxi to your nearest branch and pick up another car there, and you could cover the taxi fare. Or, if no cars are available, I'd like a refund for the remaining two days. Please let me know soon. Thank you.",
    points: [
      "상황을 시간 순서로 구체화: 'About twenty minutes ago, a warning light came on, and then ~'",
      "조건부 대안 제시: 'If that's going to take too long, maybe I could ~'",
      "요구사항을 분명히: 'I'd like a refund for the remaining two days'",
    ],
  },
  {
    questionId: "rp-car-rental-exp",
    text: "Actually, I had a pretty stressful experience on the subway last winter. I was on my way to an important meeting with a client, and I'd left home with what I thought was plenty of time. But about halfway there, the train suddenly stopped between two stations. The announcement said there was a signal problem, and we ended up waiting inside for almost thirty minutes. I was really nervous because I didn't want to be late for my first meeting with that client. So, I quickly sent a message to my manager and the client, explained the situation, and asked if we could start a little later. When the train finally moved, I got off at the next station and took a taxi the rest of the way. In the end, I was only fifteen minutes late, and the client was totally understanding. Since then, I always leave at least thirty minutes early for important appointments, just in case.",
    points: [
      "과거진행으로 배경 묘사: 'I was on my way to an important meeting'",
      "결과 표현 구문: 'we ended up waiting inside for almost thirty minutes'",
      "현재 습관으로 연결: 'Since then, I always leave ~'",
    ],
  },
  {
    questionId: "rp-gym-ask",
    text: "Hi there. I just moved into an apartment a few blocks from here, and I'm thinking about joining this gym. Do you have a few minutes to answer some questions? Thanks. First, could you tell me what kinds of memberships you offer? Oh, I see, so there are one-month, three-month, and six-month options. I was wondering how much the three-month membership is, and whether that includes the group classes, like yoga or spinning. Okay, so classes cost a little extra. Got it. Is it possible to come early in the morning before work? I usually start work at nine, so I'd like to work out around six thirty. Oh, great, you open at six. And one last thing. Do you happen to know if there are lockers and showers I can use every day, or do I need to bring my own towel? Perfect, towels are included. Thank you so much. I think I'll sign up for the three-month plan today.",
    points: [
      "자연스러운 대화 시작: 'Do you have a few minutes to answer some questions?'",
      "질문에 개인 사정 덧붙이기: 'I usually start work at nine, so I'd like to ~'",
      "선택 의문문: 'or do I need to bring my own towel?'",
    ],
  },
  {
    questionId: "rp-gym-solve",
    text: "Hi, could I speak with the manager for a moment? Thank you. I signed up for a three-month membership here about two weeks ago, and I paid the full amount in advance. Unfortunately, I hurt my leg while hiking last weekend, and the doctor said I can't do any exercise for at least a month. I have a note from the hospital right here, if you'd like to see it. So I wanted to talk about what we can do, because I really don't want to waste the money. First, is it possible to put my membership on hold for a month and extend the end date? That would be the best option for me. If that's not possible, could I transfer the remaining period to my younger sister? She lives nearby and has been wanting to join. Or, as a last option, I'd accept a partial refund for the weeks I can't use. I'd really appreciate your help with this. Thank you.",
    points: [
      "문제 근거 제시: 'I have a note from the hospital right here'",
      "선호도 순서로 대안 제시: 'That would be the best option' / 'If that's not possible, ~' / 'as a last option'",
      "구체적 요청 어휘: 'put my membership on hold' / 'extend the end date'",
    ],
  },
  {
    questionId: "rp-gym-exp",
    text: "Yes, actually. About a year ago, I signed up for a six-month Pilates class near my office. I was really motivated at first, and I went three times a week, right after work. But after about two months, my company started a big project, and I had to work late almost every day. I kept missing classes, and I felt like I was just throwing money away. So, I went to the studio and talked to the owner. I explained that my schedule had changed and asked if I could switch to weekend classes instead. Unfortunately, the weekend classes were already full, so she offered to freeze my membership for two months instead. When the project ended, I went back and finished the remaining classes. Looking back, I'm glad I asked instead of just quitting. On top of that, I learned to check my work schedule more carefully before paying for anything long-term.",
    points: [
      "반복된 과거 행동: 'I kept missing classes'",
      "간접화법으로 대화 전달: 'I explained that my schedule had changed and asked if I could ~'",
      "회고와 교훈 추가: 'Looking back, I'm glad ~' / 'On top of that, I learned to ~'",
    ],
  },
  {
    questionId: "rp-phone-repair-ask",
    text: "Hello, is this the phone repair shop near Gangnam Station? Hi, I'm calling because my phone hasn't been working well lately. The battery dies really fast, and sometimes the screen freezes for a few seconds. I have a few questions before I bring it in. First, could you tell me whether you repair this model? It's about two years old. Oh, good. I was wondering how much it usually costs to replace the battery, roughly. Okay, around eighty thousand won. That's not too bad. Is it possible to get it fixed on the same day? I use my phone for work, so I can't really be without it for long. Oh, I see, it takes about two hours if the part is in stock. And one more thing, do you happen to know if my photos and data will be safe during the repair? Okay, that's a relief. Thank you so much. I'll stop by after work tomorrow, around six.",
    points: [
      "증상을 구체적으로 설명: 'The battery dies really fast, and sometimes the screen freezes'",
      "현재완료진행으로 최근 상태: 'my phone hasn't been working well lately'",
      "감정 반응 표현: 'That's not too bad' / 'that's a relief'",
    ],
  },
  {
    questionId: "rp-phone-repair-solve",
    text: "Hi, I'm here to pick up my phone. I dropped it off on Monday for a screen replacement, and you told me it would be ready by today at noon. But now you're saying it still isn't fixed because the part hasn't arrived. I understand that things like this can happen, but I'm in a really difficult situation. I work at an IT company, and I'm on call tonight, which means I have to be reachable in case our system goes down. So, I really need a working phone today. Here's what I'd like to suggest. First, could you lend me a spare phone just for a few days, and I'll put my SIM card in it? If that's not possible, maybe you could put my phone back together with the old screen for now, since it still worked. Or, is there another branch nearby that has the part in stock? I'd really appreciate your help. Thanks.",
    points: [
      "상대 입장 인정 후 요구: 'I understand that things like this can happen, but ~'",
      "관계대명사로 이유 보충: 'I'm on call tonight, which means I have to be reachable'",
      "대안 제시 구조: 'Here's what I'd like to suggest' / 'If that's not possible, maybe you could ~'",
    ],
  },
  {
    questionId: "rp-phone-repair-exp",
    text: "Well, the one that comes to mind is my laptop. About a year ago, I accidentally spilled a whole cup of coffee on it at a cafe. I was working on a presentation for the next day, and the screen just went black. I panicked, because all my files were on it. I turned it off right away and took it to the official service center that evening. The engineer said the keyboard and part of the main board were damaged, and the repair would cost almost half the price of a new laptop. On top of that, it would take a week. Luckily, my files were saved on the cloud, so I finished the presentation on my work computer. In the end, I decided to get it repaired because the laptop was only a year old. It works fine now, but I've learned my lesson. I never put drinks right next to my laptop anymore, and I back up everything regularly.",
    points: [
      "자연스러운 도입: 'the one that comes to mind is ~'",
      "과거진행+단순과거로 사건 전개: 'I was working on a presentation ~, and the screen just went black'",
      "사역 구문과 교훈: 'I decided to get it repaired' / 'I've learned my lesson'",
    ],
  },
  {
    questionId: "rp-furniture-ask",
    text: "Hi, excuse me. I'm looking for a new sofa for my apartment, and I really like this gray one. Could I ask you a few questions about it? Thanks. First, could you tell me how big it is exactly? My living room is pretty small, so I need to make sure it fits. Oh, I see, it's about two meters wide. That should be okay. I was wondering if this sofa comes in any other colors, maybe something a little lighter, like beige. Oh, nice, so there are three colors. Is it possible to get it delivered this weekend? I'm free on Saturday afternoon. Okay, so delivery takes about a week. That's fine. And one more thing, do you happen to know if the delivery fee is included, and whether the staff can take away my old sofa? Oh, that's great, they can remove it for a small fee. Thank you so much. I think I'll order the beige one today.",
    points: [
      "매장 대면 상황 도입: 'Could I ask you a few questions about it?'",
      "질문 이유 설명: 'My living room is pretty small, so I need to make sure it fits'",
      "사역 구문 질문: 'Is it possible to get it delivered this weekend?'",
    ],
  },
  {
    questionId: "rp-furniture-solve",
    text: "Hello, I'm calling about a sofa I ordered from your store last week. The order number is 2045, under the name Kim. It was delivered about an hour ago, but unfortunately there are two problems. First, there's a long scratch on the left armrest, and one of the legs is a little loose. On top of that, it's the wrong color. I ordered beige, but the one I received is dark gray. I took some photos, so I can send them to you right away. I'd really like to get this fixed as soon as possible. So, here are a few options. Ideally, could you exchange it for a new beige sofa and pick up this one at the same time? If the beige one isn't in stock, I'd be okay with waiting a little longer, as long as you give me a firm date. Or, if that's too difficult, I'd like a full refund. Please let me know. Thank you.",
    points: [
      "문제를 항목별로 정리: 'there are two problems. First, ~ On top of that, ~'",
      "조건 붙은 양보: 'I'd be okay with waiting a little longer, as long as ~'",
      "선호 표현: 'Ideally, could you ~?'",
    ],
  },
  {
    questionId: "rp-furniture-exp",
    text: "Yes, actually. A few months ago, I ordered a small coffee machine online because I love making coffee at home on weekends. I was really excited when the box arrived, but when I opened it, the glass part was cracked, and some pieces were inside the box. The outside box looked totally fine, so I think it was packed poorly. At first I was pretty disappointed, because I'd waited almost a week for it. So I took photos of everything, including the box and the packaging, and contacted the seller through the shopping app. I explained what happened and asked for an exchange. Luckily, they replied the next day and sent a new one within three days, and they even picked up the broken one from my door. Since then, I always film myself opening expensive packages, because it makes it so much easier to prove what happened if something's wrong.",
    points: [
      "수동태로 상태 묘사: 'the glass part was cracked' / 'it was packed poorly'",
      "추측 표현: 'so I think it was packed poorly'",
      "경험에서 생긴 습관: 'Since then, I always ~, because ~'",
    ],
  },
  {
    questionId: "rp-restaurant-ask",
    text: "Hi, good afternoon. I'd like to make a reservation for a birthday dinner, and I have a few questions first. It's for my friend Minji's birthday next Friday evening, and there'll be six of us. First, could you tell me if you have a table for six around seven o'clock? Oh, great. I was wondering if you have a private room or a quieter area, since we might be a little loud when we sing. Oh, I see, the private room needs a minimum order. That's okay. Is it possible to bring our own birthday cake? I already ordered one from a bakery she loves. Okay, so there's a small fee for that. Got it. And one more thing, do you happen to know if there are any vegetarian dishes on the menu? One of our friends doesn't eat meat. Perfect. Then I'd like to book the private room for six at seven. Thank you so much.",
    points: [
      "상황 정보 먼저 제공: 'there'll be six of us'",
      "이유 붙인 간접 질문: 'I was wondering if ~, since we might be a little loud'",
      "질문 후 예약 확정: 'Then I'd like to book ~'",
    ],
  },
  {
    questionId: "rp-restaurant-solve",
    text: "Hi, this is Kim. I booked a private room for six people tonight at seven, for a birthday dinner. I'm calling because there's a small change. A few more friends heard about the party and want to come, so now we'll be about nine people instead of six. I know it's really last minute, and I'm sorry about that. So I was wondering what we can do. First, is it possible to move us to a bigger room or put an extra table in the private room? That would be the easiest option. If that's not possible, maybe we could sit in the main hall instead, as long as we're all at one long table. Or, another option is that six of us stay in the private room, and the other three join us later just for dessert and cake. I'm happy to pay any extra fee if needed. Please let me know what works for you. Thank you so much.",
    points: [
      "변경 사항 수치로 명확히: 'now we'll be about nine people instead of six'",
      "사과로 협조 유도: 'I know it's really last minute, and I'm sorry about that'",
      "양보 의사 표현: 'I'm happy to pay any extra fee if needed'",
    ],
  },
  {
    questionId: "rp-restaurant-exp",
    text: "Well, last year I planned a surprise dinner for my younger sister because she'd just gotten her first job. She'd been job hunting for almost a year, so I really wanted to celebrate properly. Since my apartment is pretty small, I decided to cook at home instead of going out, and I prepared her favorite dishes, like cream pasta, a salad, and some garlic bread. I also ordered a small cake and decorated the room with balloons. But things didn't go exactly as planned. While I was cooking, I burned the garlic bread, and the whole apartment smelled like smoke. On top of that, she arrived thirty minutes early, so the surprise was kind of ruined. But she didn't care at all. We laughed about it, opened the windows, and ate the pasta, which turned out really well. Looking back, I realized that the meal didn't have to be perfect, because the time together was what really mattered.",
    points: [
      "과거완료(진행)로 배경: 'She'd been job hunting for almost a year'",
      "전환 문장: 'But things didn't go exactly as planned'",
      "강조 구문으로 교훈: 'the time together was what really mattered'",
    ],
  },
  {
    questionId: "rp-borrow-ask",
    text: "Hey Minji, it's me. Are you busy right now? I have a quick favor to ask. You know I'm going to Jeju next month, right? I was thinking of taking some nice photos, and I remembered you have a really good camera. So I was wondering if I could borrow it for about five days. Oh, really? Thanks so much. Then I have a few questions. First, could you tell me which lenses I can take? I'd love the wide one for landscapes. Okay, got it. Is it possible to pick it up this Friday after work? I can come to your place around eight. Oh, Saturday morning is better? No problem. And do you happen to know how long the battery lasts? Should I buy an extra one? Oh, you have a spare. Perfect. Also, is there anything I should be careful about, like rain? Okay, I'll be really careful with it. Thanks again, I'll buy you dinner when I'm back.",
    points: [
      "부탁 꺼내기: 'I have a quick favor to ask'",
      "공손한 허락 요청: 'I was wondering if I could borrow it'",
      "답에 맞춰 조정하는 반응: 'Oh, Saturday morning is better? No problem.'",
    ],
  },
  {
    questionId: "rp-borrow-solve",
    text: "Hi Minji, it's me. Do you have a minute? I'm so sorry, but I have to tell you something bad. Yesterday, I was taking photos on a hill near the beach, and the strap slipped off my shoulder. The camera fell on some rocks, and now the lens is cracked and the camera won't turn on. I feel terrible because I know how much you love that camera. I just wanted to tell you right away instead of waiting until I got back. So, I've been thinking about how to make it right. First, I'll take it to the official service center as soon as I'm back in Seoul and pay for the whole repair. If it can't be fixed, I'll buy you the same model, or a newer one if they don't sell it anymore. Or, if you'd rather choose a different camera, I can just give you the money. Again, I'm really sorry. Just tell me what you'd prefer.",
    points: [
      "나쁜 소식 전하는 표현: 'I'm so sorry, but I have to tell you something bad'",
      "책임지는 태도: 'I've been thinking about how to make it right'",
      "조건문으로 대안 연결: 'If it can't be fixed, I'll ~' / 'if you'd rather ~'",
    ],
  },
  {
    questionId: "rp-borrow-exp",
    text: "Yes, unfortunately. When I was in college, I borrowed a book from one of my professors for a research paper. It was an old book that was hard to find, so he told me to take good care of it. A few weeks later, I left it on the subway by mistake. I realized it the moment the doors closed, and my heart just sank. I called the lost-and-found center right away and checked every day for a week, but nobody had turned it in. So, I went to the professor's office, explained everything honestly, and apologized. I also told him I'd try to find another copy. It took me almost a month, but I finally found a used one online and gave it to him. He was really understanding and even thanked me for being honest. Since then, I've been extra careful with anything I borrow, and I always keep it in my bag, not in my hands.",
    points: [
      "감정 묘사 표현: 'my heart just sank'",
      "시간 접속 표현: 'I realized it the moment the doors closed'",
      "현재완료로 이후 변화: 'Since then, I've been extra careful with ~'",
    ],
  },
  {
    questionId: "adv-technology-cmp",
    text: "Well, I think technology has changed a lot in the last ten years. Back then, most people already had smartphones, but we mainly used them for calls, messages, and maybe social media. For example, I remember using paper maps or asking strangers for directions when I traveled. And if I wanted to watch a movie, I usually downloaded it or went to a theater. These days, on the other hand, my phone does almost everything. I pay for coffee with it, I order groceries, and I even unlock my apartment door with an app. At work, we use AI tools to write code and summarize documents, which was hard to imagine ten years ago. I think the biggest reason for this change is that internet speeds got much faster and services moved to the cloud. Personally, I think life is way more convenient now. But at the same time, I feel like I'm on my phone too much, so I try to take a walk without it sometimes.",
    points: [
      "과거-현재 대비: 'Back then, ~' / 'These days, on the other hand, ~'",
      "변화 원인 제시: 'the biggest reason for this change is that ~'",
      "균형 잡힌 의견: 'Personally, ~ But at the same time, ~'",
    ],
  },
  {
    questionId: "adv-technology-issue",
    text: "These days, a lot of people are worried about their personal information being shared online, and I understand why. The main problem is that we give our data to so many apps and websites without really thinking about it. For example, when you sign up for a shopping app, you usually agree to a long list of terms that nobody actually reads. On top of that, there have been several big data leaks in Korea recently. My friend Minji got a text message about a leak from an online store she used, and after that she started getting a lot of spam calls. I think there are a few things that could help. Companies should be punished more strongly when they don't protect data properly, and the government should make the rules clearer. At the same time, users also need to be careful, like using different passwords. Personally, I work in IT, so I think companies should take more responsibility because they benefit the most from our data.",
    points: [
      "문제 원인 명시: 'The main problem is that ~'",
      "주변 사례로 근거: 'My friend Minji got a text message about a leak ~'",
      "수동태 해결책: 'Companies should be punished more strongly when ~'",
    ],
  },
  {
    questionId: "adv-housing-cmp",
    text: "When I was young, my family lived in a small villa, which is like a low apartment building, in a quiet neighborhood. It had three rooms, but they were pretty small, and there was no parking lot, so my dad always had to park on the street. Also, the heating wasn't great, so we used to wear thick socks inside during the winter. Today, on the other hand, most people in Seoul live in big apartment complexes. They usually have underground parking, a gym, a playground, and even a small library. On top of that, a lot of new apartments have smart systems, so you can control the lights or the heating with your phone. In my case, I live alone in a small studio, but even my place has a digital door lock and a good security system. I think these changes happened because cities got crowded and people started caring more about convenience. Personally, I miss the friendly neighbors from my childhood, though.",
    points: [
      "과거 습관 표현: 'we used to wear thick socks inside'",
      "한국 고유 개념 풀어 설명: 'a small villa, which is like a low apartment building'",
      "변화 이유 + 개인 감정: 'I think these changes happened because ~' / 'I miss ~, though'",
    ],
  },
  {
    questionId: "adv-housing-issue",
    text: "These days, housing costs are one of the biggest issues for young people in Korea, especially in Seoul. The main reason is that home prices have gone up much faster than salaries. On top of that, the deposit you need for a jeonse, which is a kind of lease, is so high that most young people can't afford it without a big loan. A good example is my younger sister. She recently got a job in Seoul, but she couldn't find a decent place near her office, so she now commutes almost two hours a day. Even I, with a stable job in IT, live in a tiny studio because anything bigger is just too expensive. People talk about a few solutions, like building more small rental homes for young workers or offering lower interest rates on loans. I think those ideas could help a bit, but the real solution is to create good jobs outside Seoul, so not everyone has to crowd into one city.",
    points: [
      "비교 구문으로 원인: 'home prices have gone up much faster than salaries'",
      "so ~ that 구문: 'is so high that most young people can't afford it'",
      "해결책 평가 후 내 의견: 'those ideas could help a bit, but the real solution is ~'",
    ],
  },
  {
    questionId: "adv-health-cmp",
    text: "I think people's ideas about health have changed quite a lot. In the past, especially in my parents' generation, being healthy mainly meant not being sick. People ate whatever they liked, and exercise wasn't really part of daily life. For example, my dad used to work late, have drinks with coworkers almost every night, and just rest on weekends. These days, on the other hand, people care much more about managing their health actively. A lot of my coworkers go to the gym or do Pilates after work, and many people check their sleep and steps with smart watches. Food has changed too. People read nutrition labels and try to eat less sugar and salt. On top of that, mental health is now seen as just as important as physical health. I think the main reason is that information is much easier to find online. Personally, I think it's a positive change, although I don't go to the gym. I just walk a lot instead.",
    points: [
      "동명사 주어로 개념 정의: 'being healthy mainly meant not being sick'",
      "동등 비교: 'is now seen as just as important as physical health'",
      "양보절로 의견 마무리: 'I think it's a positive change, although ~'",
    ],
  },
  {
    questionId: "adv-health-issue",
    text: "I definitely agree that stress is one of the biggest health problems today. I think there are a few main causes. First, a lot of people work long hours, and even after work, they keep checking messages on their phones, so they never really rest. On top of that, things like housing costs and competition at work make people worry about the future all the time. For example, a few months ago, my friend Minji was so stressed by a big project that she couldn't sleep well for weeks, and she even started getting headaches. In the end, she took a week off and started seeing a counselor, which helped a lot. I think there are some simple things people can do, like exercising regularly, turning off work notifications at night, and talking to someone they trust. Personally, I take a long walk along the Han River whenever I feel stressed, and it really clears my head. That's why I think small daily habits matter most.",
    points: [
      "원인 나열 구조: 'First, ~' / 'On top of that, ~'",
      "사역동사: 'make people worry about the future'",
      "개인 경험으로 결론 연결: 'whenever I feel stressed' / 'That's why I think ~'",
    ],
  },
  {
    questionId: "adv-transportation-cmp",
    text: "Well, public transportation in Seoul has improved a lot in the last several years. When I first moved here for college, the subway was already good, but there were fewer lines, so I often had to transfer two or three times. Also, I had to check bus times at the bus stop and just hope it came soon. These days, on the other hand, there are new subway lines and express trains, so getting around the city is much faster. On top of that, I can check exactly when my bus will arrive with an app, so I don't waste time waiting outside, especially in winter. Paying is also easier now because I just tap my phone. But some things are still the same. During rush hour, the subway is still so crowded that you can barely move. I think the improvements happened because the city invested a lot in technology. Personally, I'm really satisfied, although I still wish rush hour were less stressful.",
    points: [
      "개선점과 그대로인 점 대비: 'But some things are still the same'",
      "so ~ that 구문: 'so crowded that you can barely move'",
      "가정법 소망: 'I still wish rush hour were less stressful'",
    ],
  },
  {
    questionId: "adv-transportation-issue",
    text: "Traffic is a huge problem in big cities like Seoul. The most obvious issue is that people waste so much time on the road. For example, my manager drives to work, and on some days it takes him over an hour to go just fifteen kilometers. On top of that, heavy traffic causes air pollution and makes people stressed and tired before they even start work. The main reason, I think, is that too many people depend on their own cars, and a lot of offices are packed into just a few areas. People talk about several solutions. Some say the city should build more subway lines and bus lanes, while others say companies should allow flexible hours so that not everyone travels at the same time. There's also talk of charging fees for driving downtown. Personally, I think flexible hours are the most realistic solution, because my company started it last year and my commute became much less stressful.",
    points: [
      "다양한 견해 대비: 'Some say ~, while others say ~'",
      "목적 표현: 'so that not everyone travels at the same time'",
      "근거 있는 개인 의견: 'the most realistic solution, because my company started it last year'",
    ],
  },
  {
    questionId: "adv-shopping-cmp",
    text: "Shopping in stores and shopping online both have clear good and bad points. When I shop in a store, the biggest advantage is that I can touch things and try them on. For example, when I bought my winter coat last year, I tried on about five different ones before I found one that really fit. On the other hand, it takes a lot of time, and stores are often crowded on weekends. Online shopping, of course, is much more convenient. I can order groceries late at night, and they arrive at my door the next morning. Prices are often cheaper too. But the downside is that sometimes the product looks totally different from the photos, and returning it can be annoying. Personally, I prefer shopping online for everyday things like snacks and household items, because I live alone and don't have much time after work. But for clothes and shoes, I still go to stores, since I don't want to deal with returns.",
    points: [
      "장단점 명시 표현: 'the biggest advantage is that ~' / 'But the downside is that ~'",
      "구체 경험 예시: 'I tried on about five different ones before I found one that really fit'",
      "상황별 선호 구분: 'I prefer ~ for everyday things ~. But for clothes and shoes, ~'",
    ],
  },
  {
    questionId: "adv-shopping-issue",
    text: "Packaging waste from online shopping has become a real concern lately. The main reason is that online orders have grown so fast, and almost everything comes in boxes, plastic bags, and lots of air cushions. For example, I once ordered a tiny phone case, and it arrived in a box big enough for a pair of shoes. Since I live alone and order things pretty often, my recycling pile fills up really quickly. People worry because most of this packaging is used only once, and a lot of it can't even be recycled properly. I think both stores and customers can do better. Stores could use smaller boxes, paper tape instead of plastic, and reusable delivery bags, which some grocery apps in Korea already offer. Customers, on the other hand, could combine orders instead of buying one item at a time. Personally, I've started grouping my orders into one delivery a week. It's a small change, but I think small habits like that really add up.",
    points: [
      "생생한 예시: 'it arrived in a box big enough for a pair of shoes'",
      "주체별 해결책 대비: 'Stores could ~' / 'Customers, on the other hand, could ~'",
      "현재완료로 내 실천: 'I've started grouping my orders into one delivery a week'",
    ],
  },
  {
    questionId: "adv-environment-cmp",
    text: "I think the weather in Korea has changed quite a lot since I was a child. Back then, we had four clear seasons. Spring and fall were long and comfortable, and in winter it snowed enough for my sister and me to make snowmen almost every year. These days, on the other hand, spring and fall feel really short. It gets hot very quickly, and summers are much longer and more humid. For example, last summer, it was over thirty degrees for weeks, and I could barely sleep without the air conditioner. On top of that, we get a lot of fine dust in spring now, so I check the air quality app before I go for a walk, which I never did as a kid. Also, heavy rain has become more common, and some areas in Seoul even flooded a few years ago. I think the main reason is climate change. It worries me, because I really miss those long, pleasant falls.",
    points: [
      "since + 과거 시점과 현재완료: 'has changed quite a lot since I was a child'",
      "enough to 구문: 'it snowed enough for my sister and me to make snowmen'",
      "과거와 대비하는 관계절: 'which I never did as a kid'",
    ],
  },
  {
    questionId: "adv-environment-issue",
    text: "One environmental issue that people in Korea really care about is fine dust, which is a kind of air pollution. Especially in spring, the sky sometimes turns gray, and air quality warnings come up on everyone's phones. People care about it because it directly affects their health. It can cause coughing, sore throats, and even more serious problems for kids and older people. There are a few causes. Some of it comes from car exhaust and factories here, and some of it is blown over from neighboring countries. For example, my younger sister has asthma, so on bad days she has to wear a mask all day and can't go outside much. I think the government should reduce old diesel cars and work more closely with neighboring countries on this problem. At the same time, individuals can help by using public transportation more. Personally, on bad days I skip my evening walk, which makes me a little sad.",
    points: [
      "주제 제시 + 개념 설명: 'One environmental issue that ~ is fine dust, which is a kind of ~'",
      "원인 나누어 설명: 'Some of it comes from ~, and some of it is blown over from ~'",
      "정부와 개인 해결책 구분: 'the government should ~' / 'At the same time, individuals can help by ~'",
    ],
  },
  {
    questionId: "adv-work-cmp",
    text: "I think the way people work has changed a lot. In the past, people usually worked long hours in the office, and it was normal to stay late just because the boss hadn't left yet. My dad, for example, often came home after ten and even went to the office on Saturdays. Also, everyone had their own fixed desk, and most communication happened face to face or by phone. These days, on the other hand, things are much more flexible, especially in IT companies like mine. I work from home two days a week, and on office days I just pick any free desk. We have meetings on video calls and chat on messaging apps all day. On top of that, the government limited weekly working hours, so overtime isn't as common as before. I think the pandemic really sped up these changes. Personally, I love working from home, but I've noticed it's harder to separate work from my personal life.",
    points: [
      "과거완료로 과거 관행 설명: 'just because the boss hadn't left yet'",
      "원급 비교: 'overtime isn't as common as before'",
      "장점 인정 후 단점: 'I love working from home, but I've noticed ~'",
    ],
  },
  {
    questionId: "adv-work-issue",
    text: "I agree that balancing work and personal life is really hard these days. One big reason is that we're always connected. Even after work, people get messages from their team leaders on their phones, so it feels like the workday never really ends. On top of that, working from home has made the line between work and home even blurrier. In my case, my desk is right next to my bed, so sometimes I end up checking emails at midnight. People around me try different things to manage it. My friend Minji, for example, turns off work notifications after eight and goes to a pottery class twice a week. One of my coworkers keeps a separate phone just for work. As for me, I go for a walk right after work, which helps me switch off mentally. I think companies also need to respect people's time more. That's why I really like it when managers avoid sending messages late at night.",
    points: [
      "원인-결과 연결: 'we're always connected ~, so it feels like the workday never really ends'",
      "주변 사람 여러 사례: 'My friend Minji, for example, ~' / 'One of my coworkers ~' / 'As for me, ~'",
      "결론 연결어: 'That's why I really like it when ~'",
    ],
  },
  {
    questionId: "adv-education-cmp",
    text: "I think the way students study has changed a lot since I was in school. Back then, we mostly studied with paper textbooks and thick workbooks. If I didn't understand something, I had to ask a teacher the next day or go to an academy. I also remember carrying a big electronic dictionary everywhere for English class. These days, on the other hand, students use tablets and online lectures for almost everything. My younger cousin, for example, watches lectures from famous teachers online and replays the parts she doesn't understand. On top of that, students now use AI tools to explain difficult problems or check their writing right away. I think the main reason for this change is that the internet became faster and schools started using more digital tools during the pandemic. Personally, I think these tools are really useful, but I also worry that students might rely on them too much instead of thinking on their own.",
    points: [
      "과거 회상 표현: 'I also remember carrying ~'",
      "과거-현재 대비: 'Back then, ~' / 'These days, on the other hand, ~'",
      "장점과 우려 함께 제시: 'these tools are really useful, but I also worry that ~'",
    ],
  },
  {
    questionId: "adv-education-issue",
    text: "In Korea, it's really common for parents to spend a lot of money on private classes, and there are a few reasons for this. The biggest one is competition. Parents believe that getting into a good university leads to a good job, so they don't want their kids to fall behind. On top of that, when everyone else's kids go to academies, parents feel anxious if their own kids don't. For example, one of my older coworkers has two kids in elementary school, and he told me he spends almost a third of his salary on their academies. But there are serious concerns about this. First, it puts a huge financial burden on families. Second, kids get stressed and don't have enough time to play or rest. And it also makes the gap between rich and poor families bigger. I think schools should offer better free programs after class. Personally, I hope parents can focus more on what their kids actually enjoy.",
    points: [
      "가주어 구문: 'it's really common for parents to ~'",
      "우려 사항 순서 나열: 'First, ~' / 'Second, ~' / 'And it also ~'",
      "간접화법 사례: 'he told me he spends almost a third of his salary on ~'",
    ],
  },
];
