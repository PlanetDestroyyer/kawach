import requests

def send_sms(numbers="8459582668", message="Please help me! I am in danger."):
    url = "https://www.fast2sms.com/dev/bulkV2"

    querystring = {
        "authorization": "PXHimN0aJ1krYlto6qusOK3zA8eCb24nMUcDVZ9RTGWwSIvdFfkqC4ADuLym9j3UQIstVgnoZKrlc5OE",
        "message": message,
        "language": "english",
        "route": "q",
        "numbers": numbers  # can be a single number or comma-separated string
    }

    headers = {
        'cache-control': "no-cache"
    }

    try:
        response = requests.request("GET", url,
                                    headers=headers,
                                    params=querystring)
        print("SMS Successfully Sent ✅")
        print("Response:", response.text)  # helpful for debugging
        return response.text
    except Exception as e:
        print("Oops! Something went wrong ❌:", str(e))
        return None



