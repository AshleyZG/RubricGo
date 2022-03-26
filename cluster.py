import pandas as pd
from sklearn.metrics import confusion_matrix
from sentence_transformers import SentenceTransformer
from sklearn.cluster import AgglomerativeClustering
model = SentenceTransformer('all-MiniLM-L6-v2')

def cluster(distance):
    df = pd.read_csv('test.csv', header = 0, sep = ",")
    answers = df.iloc[:,1]
    sentences = []
    for answer in answers:
        sentences.append(answer)
    bert_embeddings = model.encode(answers)
    clustering_model = AgglomerativeClustering(n_clusters=None, distance_threshold=distance)
    clustering_model.fit(bert_embeddings)
    bert_label = clustering_model.labels_

    df_clusters = pd.DataFrame({
        "text": answers,
        "agg_bert_row": bert_label
    })
    df_clusters.to_csv("cluster.csv")
    return df_clusters

def main():
    cluster_result = cluster(2)
    print(cluster_result)

if __name__ == "__main__":
    main()