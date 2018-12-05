from bs4 import BeautifulSoup
import requests
import warnings
import datetime
import json

global times
times = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30']

global labs
labs = ['LG25', 'LG26', 'L101', 'L114', 'L125', 'L128', 'LG27']

global c_rooms
c_rooms = ['CG01', 'CG02', 'CG03', 'CG04', 'CG05', 'CG06', 'CG11',
            'CG12', 'CG20', 'CG68', 'CG86', 'C166']

def check_room(WEEK, DAY, ROOM):
    global times
    page = requests.get("https://www101.dcu.ie/timetables/feed.php?room=GLA."+ROOM+"&week="+ROOM+"&day="+DAY+"&hour=1-25&template=location", verify=False)
    soup = BeautifulSoup(page.content, 'html.parser')
    p = soup.find_all("td")
    x = []
    #Goes from the first column in the actual day onwards
    for i in range(61, len(p)):
        lecture = str(p[i]).find('colspan="')
        free = str(p[i]).find('src="../images/space.gif"')
        if free != -1:
            x.append('FREE')
        elif lecture != -1:
            #Checks the colspan for how long the lecture lasts..
            for i in range(int(str(p[i])[lecture+9])):
                x.append('NOT FREE')
    d = {}
    for i in range(len(x)):
        d[times[i]] = x[i]
    return d 

def DW():
    n = datetime.datetime.now()
    DAY = datetime.datetime.weekday(n) + 1 
    WEEK = n.isocalendar()[1] - 38
    return str(WEEK), str(DAY)

def main():
    WEEK, DAY = DW() 
    global times
    global c_rooms
    global labs
    all_labs = []
    result = {}
    for lab in labs:
        result[lab] = check_room(WEEK, DAY, lab)
    
    for room in c_rooms:
        result[room] = check_room(WEEK, DAY, room)
    print(json.dumps(result))

if __name__ == "__main__":
    main()