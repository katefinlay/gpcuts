import argparse
import sys
import os
import json
import datetime
import pandas as pd


#%%

def load_definitions():
    return pd.read_excel('./xlsx/0. General Practice Sept_2015 to July_2022 Practice Level Definitions.xlsx')

def load_headers():
    
    headers = ['PRAC_CODE',
               'PRAC_NAME',
               'PCN_CODE',
               'PCN_NAME',
               'SUB_ICB_CODE',
               'SUB_ICB_NAME',
               'ICB_CODE',
               'ICB_NAME',
               'REGION_CODE',
               'REGION_NAME',
               'TOTAL_PATIENTS',
               'GP_SOURCE',
               'TOTAL_GP_HC',
               'TOTAL_GP_EXTG_HC',
               'TOTAL_GP_EXL_HC',
               'TOTAL_GP_EXTGL_HC',
               'TOTAL_GP_SEN_PTNR_HC',
               'TOTAL_GP_PTNR_PROV_HC',
               'TOTAL_GP_SAL_BY_PRAC_HC',
               'TOTAL_GP_SAL_BY_OTH_HC',
               'TOTAL_GP_RET_HC',
               'TOTAL_GP_LOCUM_VAC_HC',
               'TOTAL_GP_LOCUM_ABS_HC',
               'TOTAL_GP_LOCUM_OTH_HC',
               'TOTAL_GP_FTE',
               'TOTAL_GP_EXTG_FTE',
               'TOTAL_GP_EXL_FTE',
               'TOTAL_GP_EXTGL_FTE',
               'TOTAL_GP_SEN_PTNR_FTE',
               'TOTAL_GP_PTNR_PROV_FTE',
               'TOTAL_GP_SAL_BY_PRAC_FTE',
               'TOTAL_GP_SAL_BY_OTH_FTE',
               'TOTAL_GP_RET_FTE',
               'TOTAL_GP_LOCUM_VAC_FTE',
               'TOTAL_GP_LOCUM_ABS_FTE',
               'TOTAL_GP_LOCUM_OTH_FTE']
    
    return headers


def load_frames(headers) -> pd.DataFrame:
    
    frames = {}
    data_path = './csv/raw'
    for file in os.listdir(data_path):
        print(file)
        file_date = file.lower().replace('–', '').split('general practice')[1].split('practice level')[0].strip()
        file_date = datetime.datetime.strptime(file_date, '%B %Y')
        file_date_str = file_date.strftime('%Y-%m')
        print(file_date)
        print(datetime.datetime(2020, 3, 1))
        print(file_date < datetime.datetime(2020, 3, 1))
        if file_date < datetime.datetime(2020, 3, 1):
            old_headers = [header for header in headers if header not in ['PCN_CODE', 'PCN_NAME']]
            df = pd.read_csv(os.path.join(data_path, file), usecols=old_headers)  
        else:
            df = pd.read_csv(os.path.join(data_path, file), usecols=headers)
        df['date'] = file_date
        frames[file_date_str] = df
    
    return frames
    

def long_panel(frames, headers):
    df = pd.concat(frames)
    headers.insert(0, 'date')
    df = df[headers].sort_values(['PRAC_CODE', 'date'])
    return df

def _get_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser()
    # parser.add_argument(
    #     '--',
    #     type=str,
    #     required=True,
    #     help='Azure blob key prefix the JSON files containing the raw '
    #          'downloaded Reddit post data will be uploaded to.')
    # parser.add_argument(
    #     '--max_batch_char_len',
    #     type=int,
    #     default=1000,
    #     help='Maximum length of a search term batch\'s query string. Batch '
    #          'query strings need to be capped to avoid exceeding the Pushshift '
    #          'API\'s max query string length limit.')
    return parser

def parse_date(date):
    try:
        datetime.strptime(int(date), '%Y%m%d').strftime('%Y-%m-%d')
    except:
        return None


def write_to_geojson(merged, panel):
    geojson = {"type": "FeatureCollection", "features": []}
    
    leeds = merged[merged['postcode_merge_col'].str[:2] == 'ls']
    
    for _, row in leeds.iterrows():
        feature = {
            "type": "Feature", 
            "geometry": {
                "type": "Point", 
                "coordinates": [
                    row['Longitude'], 
                    row['Latitude']]
                }, 
            "properties": {
                "organisation_code": row["Organisation Code"],
                "name": row['Name'],
                "address_line_1": row["Address Line 1"],
                "address_line_2": row["Address Line 2"],
                "address_line_3": row["Address Line 3"],
                "address_line_4": row["Address Line 4"],
                "address_line_5": row["Address Line 5"],
                "postcode": row["Postcode"],
                "open_date": parse_date(row["Open Date"]),
                "close_date": parse_date(row["Close Date"]),
                "status_code": row["Status Code"],
                "constituency_code": row["Constituency Code"],
                "Consituitency": row["Constituency"],
                "MP": row["MP"],
                "Party": row["Party"],  
                "total_patients": json.loads(panel.loc[(row["Organisation Code"]),('TOTAL_PATIENTS')].to_json())
                }
            }
        geojson['features'].append(feature)
    
    with open('./json/practices_new.geojson', 'w') as fp:
        json.dump(geojson, fp)

def _main(args: argparse.Namespace = None):
    headers = load_headers()
    
    try:
        frames = load_frames(headers)
    except FileNotFoundError:
        print("General Practice Workforce practice-level csv files must be placed under /data/csv/raw. See README for more details.")
            
    panel = long_panel(frames, headers)
    
    # Load Practice records with GP Data
    practice_headers = ['PRAC_CODE','PRAC_NAME','PCN_CODE','PCN_NAME','SUB_ICB_CODE','SUB_ICB_NAME',
                        'ICB_CODE','ICB_NAME', 'REGION_CODE','REGION_NAME','TOTAL_PATIENTS','GP_SOURCE']
    practices = panel[~panel['PRAC_CODE'].duplicated(keep='first')][practice_headers].copy()

    # Entire UK postcode dataset
    try:
        postcodes = pd.read_csv('./csv/postcodes/a/postcodes.csv')
    except FileNotFoundError:
        print("Postcode file must be placed under /data/csv/postcodes/postcodes.csv. See README for more details.")
    postcodes['postcode_merge_col'] = postcodes['Postcode'].str.lower().str.replace(' ','').str.strip()
    
    # Data on UK Parliamentary Constituencies
    constituencies = pd.read_csv('./csv/parliamentary_constituencies/UK Constituency Postcodes.csv')
    
    # Dataset of GP Practices past and present
    epraccur = pd.read_csv('./gplocations/epraccur_20230223.csv')
    epraccur['postcode_merge_col'] = epraccur['Postcode'].str.lower().str.replace(' ','').str.strip()
    
    # Merge practice data into one dataframe
    merged = practices.merge(epraccur, how='left', right_on='Organisation Code', left_on='PRAC_CODE')
    merged = merged.merge(postcodes[['postcode_merge_col','Latitude','Longitude','Constituency Code']], how='left', on='postcode_merge_col')
    merged = merged.merge(constituencies[['Code', 'MP', 'Party', 'Constituency']], right_on='Code', left_on='Constituency Code', how='left')
    
    panel = panel.set_index(['PRAC_CODE', 'date'])
    write_to_geojson(merged, panel)


if __name__ == '__main__':
    # args = _get_parser().parse_args(sys.argv[1:])
    panel = _main()
    
    