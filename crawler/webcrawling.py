import requests

PATH = 'https://comic.naver.com/api/webtoon/titlelist/weekday?order=user'

if __name__ == '__main__':
    response = requests.get(PATH)
    data = response.json()
    with open("webtoon.txt", "w", encoding="utf-8") as f:
        f.write(f"data is : {data}\n")
    print(data)
    