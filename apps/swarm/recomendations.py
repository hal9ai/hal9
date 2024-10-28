import random
import requests
from bs4 import BeautifulSoup

def book_recommendation():
    """
    Creates a random book recommendation from Project Gutenberg's top 100 eBooks list.
    This function scrapes Project Gutenberg's top 100 eBooks page, selects a random book from the list,
    and returns its title and a link to its Project Gutenberg page.

    Returns
    -------
    tuple of str
        A tuple containing:
            - title : str
            
                The title of the randomly selected book.
            - full_link : str
                The URL link to the selected book's page on Project Gutenberg.
    """
    response = requests.get('https://www.gutenberg.org/browse/scores/top')
    soup = BeautifulSoup(response.text, 'html.parser')

    ebooks_section = soup.find_all('ol')

    ebook = random.choice(ebooks_section[0].find_all('li'))
    
    title = ebook.text.strip()
    full_link = f"https://www.gutenberg.org{ebook.find('a')['href']}"
    
    return (title, full_link)

def comic_recommendation():
    """
    Returns a random comic recommendation from the Digital Comic Museum's top 100 comics page.
    
    This function scrapes the Digital Comic Museum's page for the top 100 most downloaded comics, 
    parses the HTML response, collects the titles and their corresponding download links, 
    and returns a random comic from the list.

    Returns
    -------
    tuple of str
        A tuple containing:
            - title : str
                The title of the randomly selected comic.
            - link : str
                The full URL to the comic's page on Digital Comic Museum.
    """
    response = requests.get("https://digitalcomicmuseum.com/stats.php?ACT=topdl&start=0&limit=100")
    soup = BeautifulSoup(response.text, 'html.parser')

    comics_list = []
    for comic in soup.find_all('a', href=True):
        if '.php' in comic['href']:
            title = comic.text.strip()
            link = f"https://digitalcomicmuseum.com/{comic['href']}"
            
            # Append to list
            if title and link:
                comics_list.append((title, link))

    return random.choice(comics_list)


def movie_recommendation():
    """
    Returns a random movie recommendation from the Public Domain Torrents website.
    
    This function scrapes the Public Domain Torrents page listing all movies, 
    parses the HTML response, collects the titles and their corresponding download links, 
    and returns a random movie from the list.

    Returns
    -------
    tuple of str
        A tuple containing:
            - title : str
                The title of the randomly selected movie.
            - link : str
                The full URL to the movie's page on Public Domain Torrents.
    """
    response = requests.get("https://www.publicdomaintorrents.info/nshowcat.html?category=ALL")
    soup = BeautifulSoup(response.text, 'html.parser')

    movies_list = []
    for movie in soup.find_all('a', href=True):
        if 'movieid' in movie['href']:
            title = movie.text.strip()
            link = f"https://digitalcomicmuseum.com/{movie['href']}"
            
            # Append to list
            if title and link:
                movies_list.append((title, link))

    return random.choice(movies_list)
