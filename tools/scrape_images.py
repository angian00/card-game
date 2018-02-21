#!/usr/bin/env python3


import json
import os
import requests
from bs4 import BeautifulSoup


card_filename = "cards.filtered.json"
image_dir = "orig_images"

base_url = "https://hearthstone.gamepedia.com"

page_filename = "sample_gamepedia_page.html"
link_filename = "image_links.txt"
custom_link_filename = "image_links_custom.txt"


def main():
	global root_dir

	root_dir = get_script_path() + "/.."
	#scrape_img_links()
	#parse_sample_file()
	download_images()


def scrape_img_links():
	global root_dir

	cards = []
	with open(root_dir + "/data/" + card_filename) as f:
		for ll in f.readlines():
			cards.append(json.loads(ll))


	print("{} cards loaded from {}".format(len(cards), card_filename))
	img_links = {}
	c_count = 0


	for c in cards:
		std_name = url_cleanup(c["name"])
		
		#check if image has already been downloaded
		if len([f for f in os.listdir(root_dir + "/" + image_dir) if f.startswith(std_name)]) > 0:
			print(" -- {}: local image already present".format(std_name))
			continue


		page_url = base_url + "/" + std_name
		#print("{} --> {}".format(c["name"], full_url))

		r = requests.get(page_url)

		if r.status_code >= 400:
			print("!! KO {} {} --> {}".format(r.status_code, std_name, page_url))
			continue

		#with open(page_filename, 'wb') as f:
		#	f.write(r.text)

		img_link = parse_page(r.text)
		if img_link is None:
			print(" !! {}: image link not found in page".format(std_name) )
		else:
			img_links[std_name] = img_link
			print(" -- {}: found image link".format(std_name) )

		c_count = c_count + 1


	with open(root_dir + "/data/" + link_filename, "w") as f:
		for std_name, img_link in img_links.items():
			f.write("{}|{}\n".format(std_name, img_link))


def download_images():
	all_lines = []

	with open(root_dir + "/data/" + link_filename) as f:
		all_lines.extend(f)

	with open(root_dir + "/data/" + custom_link_filename) as f:
		all_lines.extend(f)


	for line in all_lines:
		std_name, img_link = line.split("|")
		img_link = img_link.strip()
		#print(std_name, img_link)

		ext = img_link.split("?")[-2].split(".")[-1]

		image_path = root_dir + "/" + image_dir + "/" + std_name + "." + ext
		if os.path.isfile(image_path):
			print("-- File exists {}".format(image_path))
			continue

		try:
			r = requests.get(img_link)
		except HTTPError as e:
			print(e)
			continue

		if int(r.status_code) >= 400:
			print("!! KO {} {} --> {}".format(r.status_code, std_name, img_link))
			continue

		with open(image_path, 'wb') as fi:
			fi.write(r.content)

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


def get_script_path():
	return os.path.dirname(os.path.realpath(__file__))


if __name__ == "__main__":
	main()
	

