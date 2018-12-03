from bs4 import BeautifulSoup
import requests
import warnings
import datetime
import json

def check_lab(WEEK, DAY, ROOM):
    page = requests.get("https://www101.dcu.ie/timetables/feed.php?room=GLA."+ROOM+"&week="+ROOM+"&hour=1-20&day="+DAY+"&hour=1-20&template=location", verify=False)
    soup = BeautifulSoup(page.content, 'html.parser')
    p = soup.find_all("td")
    x = []
    s = ""
    for i in range(56, len(p)):
        lecture = str(p[i]).find('colspan="')
        free = str(p[i]).find('src="../images/space.gif"')
        if free != -1:
            x.append('FREE')
        elif lecture != -1:
            for i in range(int(str(p[i])[lecture+9])):
                x.append('NOT FREE')

    times = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00', '17:30']
    d = {}
    for i in range(len(x)):
        d[times[i]] = x[i]
    return d 

def DW():
    n = datetime.datetime.now()
    DAY = datetime.datetime.weekday(n) + 1 
    WEEK = n.isocalendar()[1] - 38
    return str(WEEK), str(DAY)


def nexttime():
    now = datetime.datetime.now()
    hour = int(now.strftime("%H"))
    minute = int(now.strftime("%M"))
    if hour < 8 or hour >= 18 or (hour == 17 and minute > 29):
        hour = "08:00"
        return hour
    else:
        if minute >= 30:
            minute = '00'
            hour += 1
        else:
            minute = 30
        if(len(str(hour))) == 1:
            hour = '0' + str(hour)
        s = str(hour)+":"+str(minute)
        return s



def main():
    WEEK, DAY = DW() 
    labs = ['LG25', 'LG26', 'L101', 'L114', 'L125', 'L128', 'LG27']
    times = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00', '17:30']
    NEXT = nexttime()
    all_labs = []
    j = {}
    for lab in labs:
        j[lab] = check_lab(WEEK, DAY, lab)
    print(json.dumps(j))

if __name__ == "__main__":
    main()