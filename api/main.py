from typing import Union
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re

from typing import Dict, List, Optional, Union

import openai
OPENAI_API_KEY = os.environ['OPENAI_API_KEY']


app = FastAPI()

origins = [
    "http://localhost:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item4MakeQuestions(BaseModel):
    purpose: str

class Item4BuildTodo(BaseModel):
    purpose: str
    questions: List[str]
    answers: List[str]

pattern = re.compile(r'^\d*[\.\s-]*')
def parse_bullets(text: str):
    lines = text.split('\n')

    lines = [
        re.sub(pattern, '', line)
        for line in lines
        if line and (line[0] in ['-', '・'] or line[0].isdigit())
    ]
    lines = [line for line in lines if line != '']
    return lines

@app.post("/api/make_questions")
def make_questions(item: Item4MakeQuestions) -> List[str]:
    input_text = f"""「{item.purpose}」という目的のためのTODOリストを生成するために必要な情報を得る質問文を列挙してください。

    下記の要件に注意して生成してください
    - 目的達成のためではなく、その前段階としてTODOリストを生成するために必要な質問文である
    - 箇条書きの質問文のみ生成
    - 5個程度の質問で簡単に答えられる
    """
    output = openai.Completion.create(
        engine="text-davinci-003",
        prompt=input_text,
        max_tokens=1024,
    )
    output = output.choices[0].text

    lines = parse_bullets(output)

    return lines

@app.post("/api/build_todo")
def build_todo(item: Item4BuildTodo) -> List[str]:
    input_text = f'目的: {item.purpose}\n質問回答：\n'
    for q, a in zip(item.questions, item.answers):
        input_text += f'- {q}：{a}\n'
    input_text += '上記を元に目的達成のためのTODOを箇条書きで生成してください\n'
    input_text += '下記の要件に注意して生成してください\n'
    input_text += '- 20個生成'

    output = openai.Completion.create(
        engine="text-davinci-003",
        prompt=input_text,
        max_tokens=1024,
    )
    output = output.choices[0].text

    lines = parse_bullets(output)

    return lines
