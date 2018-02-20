#!/usr/bin/env python3


import json
import httplib2
import http
from bs4 import BeautifulSoup



filename = "../data/cards.filtered.json"
image_dir = "../orig_images"

base_url = "https://hearthstone.gamepedia.com"

page_filename = "sample_gamepedia_page.html"
link_filename = "image_links.txt"



def main():
	scrape_img_links()
	#parse_sample_file()
	#download_images()


def scrape_img_links():
	cards = []
	with open(filename) as f:
		for ll in f.readlines():
			cards.append(json.loads(ll))


	print("{} cards loaded from {}".format(len(cards), filename))
	img_links = {}
	c_count = 0

	h = httplib2.Http()

	for c in cards:
		std_name = url_cleanup(c["name"])
		page_url = base_url + "/" + std_name
		#print("{} --> {}".format(c["name"], full_url))

		resp, page_body = h.request(page_url, "GET")

		status_code = resp['status']
		if int(status_code) >= 400:
			print("!! KO {} {} --> {}".format(status_code, std_name, page_url))
			continue

		with open(page_filename, 'wb') as f:
			f.write(page_body)

		img_link = parse_page(page_body)
		if img_link is None:
			print(" !! {} img not found".format(std_name) )
		else:
			img_links[std_name] = img_link
			print(" -- Found image for {} ".format(std_name) )

		c_count = c_count + 1


	with open(link_filename, "w") as f:
		for std_name, img_link in img_links.items():
			f.write("{}|{}\n".format(std_name, img_link))


def download_images():
	h = httplib2.Http()
	#httplib2.debuglevel = 1000

	with open(link_filename) as f:
		for line in f:
			std_name, img_link = line.split("|")
			img_link = img_link.strip()
			#print(std_name, img_link)

			ext = img_link.split("?")[-2].split(".")[-1]

			try:
				resp, content = h.request(img_link, "GET")
			except http.client.HTTPException as e:
				print(e)
				continue

			status_code = resp['status']
			if int(status_code) >= 400:
				print("!! KO {} {} --> {}".format(status_code, std_name, img_link))
				continue

			with open(image_dir + "/" + std_name + "." + ext, 'wb') as fi:
				fi.write(content)

			print("-- OK {}".format(std_name, img_link))


def parse_sample_file():
	with open(page_filename, 'r') as f:
		body = f.read()
	
	img_link = parse_page(body)


def parse_page(body):
	soup = BeautifulSoup(body, 'html.parser')
	for div in soup.find_all("div", class_="thumb"):
		#print(div)
		img = div.find("img")
		if not img is None:
			return img.get("src")

	return None


def url_cleanup(str):
	return str.replace(" ", "_")


if __name__ == "__main__":
	main()
	

